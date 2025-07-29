/**
 * Mock Database Mode for Testing Enhanced Question Bank
 * Use this when Supabase is paused or for offline development
 */

export const mockDatabaseMode = {
  enabled: process.env.MOCK_DATABASE === 'true',
  
  async mockAssessmentSubmission(assessmentData: any) {
    console.log('🧪 Mock Database Mode: Assessment submission simulated');
    console.log('Assessment Data:', {
      tier: assessmentData.tier,
      organizationType: assessmentData.organizationType,
      institutionName: assessmentData.institutionName,
      responseCount: Object.keys(assessmentData.responses).length,
      uploadedFileCount: assessmentData.uploadedFiles?.length || 0
    });
    
    // Simulate successful submission
    const mockId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      assessmentId: mockId,
      sessionId: `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: 'Assessment submitted successfully (mock mode)',
      redirectUrl: `/assessment/results?sessionId=mock_session&tier=${assessmentData.tier}&orgType=${assessmentData.organizationType}`
    };
  }
};

export default mockDatabaseMode;
