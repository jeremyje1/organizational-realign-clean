import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Query Keys
export const queryKeys = {
  assessments: ['assessments'] as const,
  assessment: (id: string) => ['assessments', id] as const,
  userAssessments: (userId: string) => ['assessments', 'user', userId] as const,
  analytics: ['analytics'] as const,
  teamAnalytics: (teamId: string) => ['analytics', 'team', teamId] as const,
  organizations: ['organizations'] as const,
  organization: (id: string) => ['organizations', id] as const,
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  results: ['results'] as const,
  result: (id: string) => ['results', id] as const,
} as const

// Assessment Hooks
export function useAssessments(filters?: { userId?: string; status?: string }) {
  return useQuery({
    queryKey: filters?.userId 
      ? queryKeys.userAssessments(filters.userId) 
      : queryKeys.assessments,
    queryFn: async () => {
      let query = supabase.from('assessments').select('*')
      
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId)
      }
      
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw new Error(error.message)
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useAssessment(id: string | null) {
  return useQuery({
    queryKey: queryKeys.assessment(id || ''),
    queryFn: async () => {
      if (!id) throw new Error('Assessment ID is required')
      
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateAssessment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (assessment: any) => {
      const { data, error } = await supabase
        .from('assessments')
        .insert(assessment)
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: (data) => {
      // Invalidate and refetch assessments
      queryClient.invalidateQueries({ queryKey: queryKeys.assessments })
      
      // Add the new assessment to the cache
      queryClient.setQueryData(queryKeys.assessment(data.id), data)
    },
  })
}

export function useUpdateAssessment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('assessments')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: (data) => {
      // Update the specific assessment in cache
      queryClient.setQueryData(queryKeys.assessment(data.id), data)
      
      // Invalidate assessments list to reflect changes
      queryClient.invalidateQueries({ queryKey: queryKeys.assessments })
    },
  })
}

// Organization Hooks
export function useOrganizations() {
  return useQuery({
    queryKey: queryKeys.organizations,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name')
      
      if (error) throw new Error(error.message)
      return data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useOrganization(id: string | null) {
  return useQuery({
    queryKey: queryKeys.organization(id || ''),
    queryFn: async () => {
      if (!id) throw new Error('Organization ID is required')
      
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}

// Analytics Hooks
export function useAnalytics(filters?: { timeRange?: string; teamId?: string }) {
  return useQuery({
    queryKey: filters?.teamId 
      ? queryKeys.teamAnalytics(filters.teamId)
      : queryKeys.analytics,
    queryFn: async () => {
      const params = new URLSearchParams()
      
      if (filters?.timeRange) params.append('timeRange', filters.timeRange)
      if (filters?.teamId) params.append('teamId', filters.teamId)
      
      const response = await fetch(`/api/analytics?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Analytics fetch failed: ${response.statusText}`)
      }
      
      return response.json()
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for analytics
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
  })
}

// Results Hooks
export function useResults(filters?: { userId?: string; assessmentId?: string }) {
  return useQuery({
    queryKey: queryKeys.results,
    queryFn: async () => {
      let query = supabase.from('assessment_results').select(`
        *,
        assessments (
          id,
          name,
          organization_name,
          created_at
        )
      `)
      
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId)
      }
      
      if (filters?.assessmentId) {
        query = query.eq('assessment_id', filters.assessmentId)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw new Error(error.message)
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useResult(id: string | null) {
  return useQuery({
    queryKey: queryKeys.result(id || ''),
    queryFn: async () => {
      if (!id) throw new Error('Result ID is required')
      
      const { data, error } = await supabase
        .from('assessment_results')
        .select(`
          *,
          assessments (
            id,
            name,
            organization_name,
            created_at
          )
        `)
        .eq('id', id)
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}

// Generic API hooks
export function useApiQuery<T>(
  endpoint: string, 
  queryKey: readonly unknown[], 
  options?: {
    enabled?: boolean
    staleTime?: number
    refetchInterval?: number
  }
) {
  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      const response = await fetch(endpoint)
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }
      
      return response.json()
    },
    enabled: options?.enabled,
    staleTime: options?.staleTime || 5 * 60 * 1000,
    refetchInterval: options?.refetchInterval,
  })
}

export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData) => void
    onError?: (error: Error) => void
    invalidateQueries?: readonly unknown[][]
  }
) {
  const queryClient = useQueryClient()
  
  return useMutation<TData, Error, TVariables>({
    mutationFn,
    onSuccess: (data) => {
      options?.onSuccess?.(data)
      
      // Invalidate specified queries
      options?.invalidateQueries?.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey })
      })
    },
    onError: options?.onError,
  })
}

// Optimistic update helpers
export function useOptimisticUpdate<T>(queryKey: readonly unknown[]) {
  const queryClient = useQueryClient()
  
  return {
    setOptimisticData: (data: T) => {
      queryClient.setQueryData(queryKey, data)
    },
    
    rollbackOptimisticUpdate: () => {
      queryClient.invalidateQueries({ queryKey })
    },
    
    confirmOptimisticUpdate: () => {
      // Data is already set, just mark as stale to refetch if needed
      queryClient.invalidateQueries({ queryKey, refetchType: 'none' })
    }
  }
}
