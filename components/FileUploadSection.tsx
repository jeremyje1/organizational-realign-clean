/**
 * File Upload Section for One-Time Diagnostic Package
 * Professional organizational data collection interface
 * 
 * @version 1.0.0  
 * @author NorthPath Strategies
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedFileUpload } from '@/components/ui/enhanced-file-upload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileSpreadsheet, 
  FileText, 
  Building, 
  Users, 
  DollarSign, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface FileUploadSectionProps {
  onFilesUploaded: (files: { [key: string]: File[] }) => void;
  className?: string;
}

const UPLOAD_CATEGORIES = {
  organizational: {
    title: 'Organizational Structure',
    description: 'Current org charts, reporting structures, and hierarchy documents',
    icon: Building,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    acceptedTypes: ['.pdf', '.png', '.jpg', '.jpeg', '.docx', '.xlsx'],
    examples: [
      'Current organizational chart (PDF/Image)',
      'Department structure diagrams',
      'Reporting relationship documents',
      'Job descriptions and role definitions'
    ],
    required: true
  },
  financial: {
    title: 'Financial & Budget Data',
    description: 'Budget documents, salary information, and cost data',
    icon: DollarSign,
    color: 'bg-green-50 text-green-700 border-green-200',
    acceptedTypes: ['.xlsx', '.xls', '.csv', '.pdf'],
    examples: [
      'Annual budget spreadsheets',
      'Position salary data (CSV/Excel)',
      'Department cost allocation',
      'Financial summary reports'
    ],
    required: true
  },
  personnel: {
    title: 'Personnel & HR Data',
    description: 'Staff directories, employee data, and HR information',
    icon: Users,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    acceptedTypes: ['.xlsx', '.xls', '.csv', '.pdf'],
    examples: [
      'Employee directory (Excel/CSV)',
      'Staff roster with positions',
      'Organizational units listing',
      'HR policies and procedures'
    ],
    required: true
  },
  strategic: {
    title: 'Strategic Documents',
    description: 'Strategic plans, policies, and governance documents',
    icon: FileText,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    acceptedTypes: ['.pdf', '.docx', '.doc'],
    examples: [
      'Strategic plan documents',
      'Mission, vision, values statements',
      'Board governance policies',
      'Operational procedures'
    ],
    required: false
  }
};

export function FileUploadSection({ onFilesUploaded, className }: FileUploadSectionProps) {
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({
    organizational: [],
    financial: [],
    personnel: [],
    strategic: []
  });

  const [activeTab, setActiveTab] = useState('organizational');

  const handleCategoryUpload = (category: string, files: File[]) => {
    const updatedFiles = {
      ...uploadedFiles,
      [category]: files
    };
    setUploadedFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
  };

  const getTotalFiles = () => {
    return Object.values(uploadedFiles).reduce((total, files) => total + files.length, 0);
  };

  const getRequiredCategoriesCompleted = () => {
    return Object.entries(UPLOAD_CATEGORIES).filter(([key, category]) => 
      category.required && uploadedFiles[key].length > 0
    ).length;
  };

  const getTotalRequiredCategories = () => {
    return Object.values(UPLOAD_CATEGORIES).filter(cat => cat.required).length;
  };

  const isUploadComplete = () => {
    return getRequiredCategoriesCompleted() === getTotalRequiredCategories();
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Organizational Data Upload</CardTitle>
              <CardDescription className="text-base mt-2">
                Upload your organizational documents for comprehensive analysis. Our AI will process 
                these files to generate detailed insights and recommendations.
              </CardDescription>
            </div>
            <div className="text-right space-y-2">
              <Badge variant={isUploadComplete() ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                {getRequiredCategoriesCompleted()} of {getTotalRequiredCategories()} Required Complete
              </Badge>
              <p className="text-sm text-muted-foreground">
                {getTotalFiles()} files uploaded
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {Object.entries(UPLOAD_CATEGORIES).map(([key, category]) => {
                const IconComponent = category.icon;
                const hasFiles = uploadedFiles[key].length > 0;
                
                return (
                  <TabsTrigger 
                    key={key} 
                    value={key} 
                    className="flex items-center space-x-2 text-sm"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="hidden sm:inline">{category.title.split(' ')[0]}</span>
                    {hasFiles && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                    {category.required && !hasFiles && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Object.entries(UPLOAD_CATEGORIES).map(([key, category]) => {
              const IconComponent = category.icon;
              
              return (
                <TabsContent key={key} value={key} className="mt-6">
                  <div className="space-y-6">
                    {/* Category Header */}
                    <div className={`p-4 rounded-lg border ${category.color}`}>
                      <div className="flex items-start space-x-3">
                        <IconComponent className="h-6 w-6 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg flex items-center space-x-2">
                            <span>{category.title}</span>
                            {category.required && (
                              <Badge variant="outline" className="text-xs">Required</Badge>
                            )}
                          </h3>
                          <p className="text-sm mt-1 opacity-80">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Example Files */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <Info className="h-4 w-4 text-blue-500" />
                        <h4 className="font-medium text-sm">Example Files to Upload:</h4>
                      </div>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {category.examples.map((example, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* File Upload Component */}
                    <EnhancedFileUpload
                      onFilesSelected={(files) => handleCategoryUpload(key, files)}
                      acceptedTypes={category.acceptedTypes}
                      maxFiles={category.required ? 5 : 3}
                      maxFileSize={50} // 50MB for institutional documents
                    />

                    {/* Upload Tips */}
                    <div className="text-xs text-gray-500 space-y-1">
                      <p><strong>Tip:</strong> For best results, ensure files are clearly labeled and up-to-date.</p>
                      <p><strong>Privacy:</strong> All uploaded files are encrypted and processed securely.</p>
                      <p><strong>Formats:</strong> {category.acceptedTypes.join(', ')} up to 25MB each.</p>
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>

          {/* Upload Progress Summary */}
          {getTotalFiles() > 0 && (
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${isUploadComplete() ? 'bg-green-500' : 'bg-blue-500'}`}>
                    <FileSpreadsheet className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                      {isUploadComplete() ? 'Upload Complete!' : 'Upload in Progress'}
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {getTotalFiles()} files ready for analysis • 
                      {isUploadComplete() ? ' All required categories complete' : ` ${getTotalRequiredCategories() - getRequiredCategoriesCompleted()} required categories remaining`}
                    </p>
                  </div>
                </div>

                {isUploadComplete() && (
                  <Button 
                    variant="default" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      // This would trigger the next step in the assessment
                      console.log('Proceeding to analysis with files:', uploadedFiles);
                    }}
                  >
                    Proceed to Analysis
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default FileUploadSection;
