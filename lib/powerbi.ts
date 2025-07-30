/**
 * Power BI Embedded Client Utility
 * Handles authentication and embed token generation for Power BI reports
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

import { ConfidentialClientApplication } from '@azure/msal-node';

// Power BI API configuration
const POWER_BI_API_BASE = 'https://api.powerbi.com/v1.0/myorg';
const POWER_BI_SCOPE = 'https://analysis.windows.net/powerbi/api/.default';
const AUTHORITY = 'https://login.microsoftonline.com/common';

// Types for Power BI responses
export interface PowerBIEmbedToken {
  token: string;
  tokenId: string;
  expiration: string;
}

export interface PowerBIReport {
  id: string;
  reportType: string;
  name: string;
  webUrl: string;
  embedUrl: string;
  isFromPbix: boolean;
  isOwnedByMe: boolean;
  datasetId: string;
  datasetWorkspaceId: string;
}

export interface EmbedConfig {
  type: 'report';
  id: string;
  embedUrl: string;
  accessToken: string;
  tokenType: number;
  settings: {
    panes: {
      filters: { expanded: boolean; visible: boolean };
      pageNavigation: { visible: boolean };
    };
    background: number;
  };
}

/**
 * Get Power BI access token using client credentials flow
 */
export async function getPowerBIAccessToken(): Promise<string> {
  try {
    const cca = new ConfidentialClientApplication({
      auth: {
        clientId: process.env.POWER_BI_CLIENT_ID!,
        clientSecret: process.env.POWER_BI_CLIENT_SECRET!,
        authority: AUTHORITY,
      },
    });

    const clientCredentialRequest = {
      scopes: [POWER_BI_SCOPE],
      skipCache: false, // Set to true if you want to skip the cache
    };

    const response = await cca.acquireTokenByClientCredential(clientCredentialRequest);
    
    if (!response?.accessToken) {
      throw new Error('Failed to acquire access token');
    }

    return response.accessToken;
  } catch (error) {
    console.error('Error acquiring Power BI access token:', error);
    throw new Error('Failed to authenticate with Power BI');
  }
}

/**
 * Generate embed token for a specific Power BI report
 */
export async function getEmbedToken(
  reportId: string,
  datasetId?: string,
  workspaceId?: string
): Promise<PowerBIEmbedToken> {
  try {
    const accessToken = await getPowerBIAccessToken();
    
    // Determine the API endpoint based on workspace
    const baseUrl = workspaceId 
      ? `${POWER_BI_API_BASE}/groups/${workspaceId}`
      : POWER_BI_API_BASE;
    
    const embedTokenUrl = `${baseUrl}/reports/${reportId}/GenerateToken`;
    
    // Prepare request body
    const requestBody: any = {
      accessLevel: 'View',
    };
    
    // Include dataset if provided
    if (datasetId) {
      requestBody.datasets = [{ id: datasetId }];
    }

    const response = await fetch(embedTokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Power BI API error: ${response.status} - ${errorText}`);
    }

    const embedToken: PowerBIEmbedToken = await response.json();
    return embedToken;
  } catch (error) {
    console.error('Error generating embed token:', error);
    throw new Error('Failed to generate Power BI embed token');
  }
}

/**
 * Get Power BI report details
 */
export async function getReportDetails(
  reportId: string,
  workspaceId?: string
): Promise<PowerBIReport> {
  try {
    const accessToken = await getPowerBIAccessToken();
    
    const baseUrl = workspaceId 
      ? `${POWER_BI_API_BASE}/groups/${workspaceId}`
      : POWER_BI_API_BASE;
    
    const reportUrl = `${baseUrl}/reports/${reportId}`;

    const response = await fetch(reportUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Power BI API error: ${response.status} - ${errorText}`);
    }

    const report: PowerBIReport = await response.json();
    return report;
  } catch (error) {
    console.error('Error fetching report details:', error);
    throw new Error('Failed to fetch Power BI report details');
  }
}

/**
 * Generate complete embed configuration for Power BI report
 */
export async function getEmbedConfig(
  reportId: string,
  workspaceId?: string,
  datasetId?: string
): Promise<EmbedConfig> {
  try {
    // Get report details first if dataset ID is not provided
    let report: PowerBIReport;
    let embedToken: PowerBIEmbedToken;
    
    if (datasetId) {
      // If dataset ID is provided, get report and token in parallel
      [report, embedToken] = await Promise.all([
        getReportDetails(reportId, workspaceId),
        getEmbedToken(reportId, datasetId, workspaceId),
      ]);
    } else {
      // Get report first to extract dataset ID, then get token
      report = await getReportDetails(reportId, workspaceId);
      embedToken = await getEmbedToken(reportId, report.datasetId, workspaceId);
    }

    const config: EmbedConfig = {
      type: 'report',
      id: reportId,
      embedUrl: report.embedUrl,
      accessToken: embedToken.token,
      tokenType: 0, // Embed token
      settings: {
        panes: {
          filters: {
            expanded: false,
            visible: true,
          },
          pageNavigation: {
            visible: true,
          },
        },
        background: 0, // Default background
      },
    };

    return config;
  } catch (error) {
    console.error('Error generating embed config:', error);
    throw new Error('Failed to generate Power BI embed configuration');
  }
}

/**
 * Validate Power BI environment variables
 */
export function validatePowerBIConfig(): boolean {
  const requiredEnvVars = [
    'POWER_BI_CLIENT_ID',
    'POWER_BI_CLIENT_SECRET',
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing Power BI environment variables:', missingVars);
    return false;
  }

  return true;
}

/**
 * Get all reports from a workspace (optional utility function)
 */
export async function getWorkspaceReports(workspaceId?: string): Promise<PowerBIReport[]> {
  try {
    const accessToken = await getPowerBIAccessToken();
    
    const baseUrl = workspaceId 
      ? `${POWER_BI_API_BASE}/groups/${workspaceId}`
      : POWER_BI_API_BASE;
    
    const reportsUrl = `${baseUrl}/reports`;

    const response = await fetch(reportsUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Power BI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.value || [];
  } catch (error) {
    console.error('Error fetching workspace reports:', error);
    throw new Error('Failed to fetch workspace reports');
  }
}
