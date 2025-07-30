/**
 * Enhanced Test Data for Scenario Engine
 * Comprehensive organizational structures for testing scenario comparisons
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

import { OrganizationalBaseline, OrganizationalVariant, EmployeeRecord, Department } from '@/types/scenario';

/**
 * Create realistic baseline organizational structure
 */
export function createRealisticBaseline(): OrganizationalBaseline {
  const departments: Department[] = [
    {
      id: 'dept_1',
      name: 'Executive',
      managerId: 'emp_1',
      employeeCount: 5,
      annualBudget: 2000000
    },
    {
      id: 'dept_2',
      name: 'Operations',
      managerId: 'emp_2',
      employeeCount: 150,
      annualBudget: 12000000
    },
    {
      id: 'dept_3',
      name: 'Finance',
      managerId: 'emp_3',
      employeeCount: 25,
      annualBudget: 2500000
    },
    {
      id: 'dept_4',
      name: 'Human Resources',
      managerId: 'emp_4',
      employeeCount: 15,
      annualBudget: 1800000
    },
    {
      id: 'dept_5',
      name: 'Technology',
      managerId: 'emp_5',
      employeeCount: 45,
      annualBudget: 5500000
    },
    {
      id: 'dept_6',
      name: 'Marketing',
      managerId: 'emp_6',
      employeeCount: 20,
      annualBudget: 3200000
    }
  ];

  const employeeData: EmployeeRecord[] = [
    // Executive Team
    {
      id: 'emp_1',
      name: 'Sarah Johnson',
      title: 'Chief Executive Officer',
      department: 'Executive',
      salary: 350000,
      benefits: 105000,
      startDate: new Date('2020-01-15'),
      level: 1,
      isManager: true
    },
    {
      id: 'emp_2',
      name: 'Michael Chen',
      title: 'Chief Operations Officer',
      department: 'Operations',
      managerId: 'emp_1',
      salary: 280000,
      benefits: 84000,
      startDate: new Date('2020-03-01'),
      level: 2,
      isManager: true
    },
    {
      id: 'emp_3',
      name: 'Jennifer Davis',
      title: 'Chief Financial Officer',
      department: 'Finance',
      managerId: 'emp_1',
      salary: 270000,
      benefits: 81000,
      startDate: new Date('2020-06-15'),
      level: 2,
      isManager: true
    },
    {
      id: 'emp_4',
      name: 'Robert Martinez',
      title: 'VP Human Resources',
      department: 'Human Resources',
      managerId: 'emp_1',
      salary: 220000,
      benefits: 66000,
      startDate: new Date('2021-01-10'),
      level: 2,
      isManager: true
    },
    {
      id: 'emp_5',
      name: 'Lisa Thompson',
      title: 'Chief Technology Officer',
      department: 'Technology',
      managerId: 'emp_1',
      salary: 300000,
      benefits: 90000,
      startDate: new Date('2020-09-01'),
      level: 2,
      isManager: true
    },
    {
      id: 'emp_6',
      name: 'David Wilson',
      title: 'VP Marketing',
      department: 'Marketing',
      managerId: 'emp_1',
      salary: 240000,
      benefits: 72000,
      startDate: new Date('2021-03-15'),
      level: 2,
      isManager: true
    },

    // Operations Department - Directors
    {
      id: 'emp_7',
      name: 'Amanda Rodriguez',
      title: 'Director of Operations',
      department: 'Operations',
      managerId: 'emp_2',
      salary: 180000,
      benefits: 54000,
      startDate: new Date('2021-05-01'),
      level: 3,
      isManager: true
    },
    {
      id: 'emp_8',
      name: 'James Lee',
      title: 'Director of Supply Chain',
      department: 'Operations',
      managerId: 'emp_2',
      salary: 175000,
      benefits: 52500,
      startDate: new Date('2021-07-15'),
      level: 3,
      isManager: true
    },

    // Finance Department - Directors
    {
      id: 'emp_9',
      name: 'Karen White',
      title: 'Director of Financial Planning',
      department: 'Finance',
      managerId: 'emp_3',
      salary: 160000,
      benefits: 48000,
      startDate: new Date('2021-08-01'),
      level: 3,
      isManager: true
    },
    {
      id: 'emp_10',
      name: 'Steven Brown',
      title: 'Director of Accounting',
      department: 'Finance',
      managerId: 'emp_3',
      salary: 155000,
      benefits: 46500,
      startDate: new Date('2021-09-15'),
      level: 3,
      isManager: true
    },

    // HR Department - Directors
    {
      id: 'emp_11',
      name: 'Maria Garcia',
      title: 'Director of Talent Acquisition',
      department: 'Human Resources',
      managerId: 'emp_4',
      salary: 140000,
      benefits: 42000,
      startDate: new Date('2021-11-01'),
      level: 3,
      isManager: true
    },

    // Technology Department - Directors
    {
      id: 'emp_12',
      name: 'Alex Kim',
      title: 'Director of Engineering',
      department: 'Technology',
      managerId: 'emp_5',
      salary: 190000,
      benefits: 57000,
      startDate: new Date('2021-04-01'),
      level: 3,
      isManager: true
    },
    {
      id: 'emp_13',
      name: 'Emily Clark',
      title: 'Director of Product',
      department: 'Technology',
      managerId: 'emp_5',
      salary: 185000,
      benefits: 55500,
      startDate: new Date('2021-06-15'),
      level: 3,
      isManager: true
    },

    // Marketing Department - Directors
    {
      id: 'emp_14',
      name: 'Ryan Johnson',
      title: 'Director of Digital Marketing',
      department: 'Marketing',
      managerId: 'emp_6',
      salary: 150000,
      benefits: 45000,
      startDate: new Date('2021-10-01'),
      level: 3,
      isManager: true
    }
  ];

  // Add managers and individual contributors to reach realistic headcount
  const additionalEmployees = generateAdditionalEmployees();
  employeeData.push(...additionalEmployees);

  return {
    organizationChart: {
      id: 'root',
      name: 'NorthPath Strategies',
      title: 'Organization',
      department: 'Executive',
      level: 0,
      directReports: employeeData
        .filter(emp => !emp.managerId)
        .map(emp => ({
          id: emp.id,
          name: emp.name,
          title: emp.title,
          department: emp.department,
          level: emp.level,
          directReports: [],
          salary: emp.salary,
          benefits: emp.benefits
        }))
    },
    costStructure: {
      totalAnnualCost: 27000000,
      costBreakdown: {
        salaries: 18500000,
        benefits: 5550000,
        overhead: 1800000,
        technology: 800000,
        facilities: 250000,
        other: 100000
      },
      costCenters: departments.map(dept => ({
        id: dept.id,
        name: dept.name,
        category: 'Department',
        annualBudget: dept.annualBudget,
        actualCost: dept.annualBudget * 0.95,
        employees: dept.employeeCount,
        costPerEmployee: dept.annualBudget / dept.employeeCount
      }))
    },
    currentMetrics: {
      totalEmployees: 260,
      managementLayers: 4,
      averageSpanOfControl: 7.2,
      managementRatio: 0.15,
      costPerEmployee: 103846,
      totalAnnualCost: 27000000,
      departmentCount: 6
    },
    employeeData,
    departments
  };
}

/**
 * Create optimized variant organizational structure
 */
export function createOptimizedVariant(): OrganizationalVariant {
  const baseline = createRealisticBaseline();
  
  // Simulate organizational optimization
  const optimizedEmployees = baseline.employeeData.filter(emp => {
    // Remove some middle management positions
    if (emp.level === 3 && emp.department === 'Operations' && emp.title.includes('Director')) {
      return Math.random() > 0.3; // Remove 30% of operations directors
    }
    return true;
  });

  // Adjust reporting structures
  optimizedEmployees.forEach(emp => {
    if (emp.managerId === 'emp_7' || emp.managerId === 'emp_8') {
      emp.managerId = 'emp_2'; // Report directly to COO
    }
  });

  return {
    proposedChart: {
      id: 'root_optimized',
      name: 'NorthPath Strategies - Optimized',
      title: 'Organization',
      department: 'Executive',
      level: 0,
      directReports: optimizedEmployees
        .filter(emp => !emp.managerId)
        .map(emp => ({
          id: emp.id,
          name: emp.name,
          title: emp.title,
          department: emp.department,
          level: emp.level,
          directReports: [],
          salary: emp.salary,
          benefits: emp.benefits
        }))
    },
    proposedCostStructure: {
      totalAnnualCost: 24500000,
      costBreakdown: {
        salaries: 16800000,
        benefits: 5040000,
        overhead: 1600000,
        technology: 800000,
        facilities: 200000,
        other: 60000
      },
      costCenters: baseline.costStructure.costCenters.map(cc => ({
        ...cc,
        annualBudget: cc.annualBudget * 0.9,
        actualCost: cc.actualCost * 0.9,
        costPerEmployee: (cc.annualBudget * 0.9) / cc.employees
      }))
    },
    projectedMetrics: {
      totalEmployees: 245,
      managementLayers: 3,
      averageSpanOfControl: 8.5,
      managementRatio: 0.12,
      costPerEmployee: 100000,
      totalAnnualCost: 24500000,
      departmentCount: 6,
      projectedSavings: 2500000,
      efficiencyGains: 0.15,
      riskAdjustment: 0.05
    },
    changesRequired: [
      {
        type: 'ELIMINATION',
        description: 'Eliminate redundant director positions in Operations',
        impactedPositions: ['emp_7', 'emp_8'],
        timeline: '3 months',
        cost: 50000,
        riskLevel: 'medium'
      },
      {
        type: 'RESTRUCTURE',
        description: 'Flatten reporting structure in Operations',
        impactedPositions: ['emp_2'],
        timeline: '2 months',
        cost: 25000,
        riskLevel: 'low'
      }
    ],
    implementationPlan: [
      {
        phase: 'Planning',
        duration: '1 month',
        activities: ['Stakeholder alignment', 'Change communication', 'Risk assessment'],
        dependencies: [],
        cost: 15000
      },
      {
        phase: 'Transition',
        duration: '3 months',
        activities: ['Position eliminations', 'Reporting changes', 'Process updates'],
        dependencies: ['Planning'],
        cost: 60000
      },
      {
        phase: 'Stabilization',
        duration: '2 months',
        activities: ['Performance monitoring', 'Adjustment implementation', 'Success measurement'],
        dependencies: ['Transition'],
        cost: 20000
      }
    ]
  };
}

/**
 * Generate additional employees to reach realistic headcount
 */
function generateAdditionalEmployees(): EmployeeRecord[] {
  const additionalEmployees: EmployeeRecord[] = [];
  
  // Add managers
  const managers = [
    // Operations Managers
    { managerId: 'emp_7', department: 'Operations', title: 'Operations Manager', level: 4, salary: 120000, count: 5 },
    { managerId: 'emp_8', department: 'Operations', title: 'Supply Chain Manager', level: 4, salary: 115000, count: 3 },
    
    // Finance Managers
    { managerId: 'emp_9', department: 'Finance', title: 'Financial Analyst Manager', level: 4, salary: 110000, count: 2 },
    { managerId: 'emp_10', department: 'Finance', title: 'Accounting Manager', level: 4, salary: 105000, count: 2 },
    
    // HR Managers
    { managerId: 'emp_11', department: 'Human Resources', title: 'Talent Acquisition Manager', level: 4, salary: 100000, count: 1 },
    
    // Technology Managers
    { managerId: 'emp_12', department: 'Technology', title: 'Engineering Manager', level: 4, salary: 140000, count: 4 },
    { managerId: 'emp_13', department: 'Technology', title: 'Product Manager', level: 4, salary: 135000, count: 3 },
    
    // Marketing Managers
    { managerId: 'emp_14', department: 'Marketing', title: 'Marketing Manager', level: 4, salary: 110000, count: 2 }
  ];

  let empId = 50;
  managers.forEach(mgr => {
    for (let i = 0; i < mgr.count; i++) {
      additionalEmployees.push({
        id: `emp_${empId++}`,
        name: `Manager ${empId}`,
        title: mgr.title,
        department: mgr.department,
        managerId: mgr.managerId,
        salary: mgr.salary + (Math.random() * 20000 - 10000),
        benefits: (mgr.salary * 0.3),
        startDate: new Date(2021 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), 1),
        level: mgr.level,
        isManager: true
      });
    }
  });

  // Add individual contributors
  const contributors = [
    // Operations Staff
    { managerId: 'emp_50', department: 'Operations', title: 'Operations Specialist', level: 5, salary: 75000, count: 8 },
    { managerId: 'emp_51', department: 'Operations', title: 'Operations Coordinator', level: 5, salary: 65000, count: 10 },
    { managerId: 'emp_55', department: 'Operations', title: 'Supply Chain Analyst', level: 5, salary: 70000, count: 6 },
    
    // Finance Staff
    { managerId: 'emp_58', department: 'Finance', title: 'Financial Analyst', level: 5, salary: 80000, count: 8 },
    { managerId: 'emp_59', department: 'Finance', title: 'Accountant', level: 5, salary: 70000, count: 6 },
    
    // HR Staff
    { managerId: 'emp_61', department: 'Human Resources', title: 'HR Generalist', level: 5, salary: 75000, count: 5 },
    { managerId: 'emp_61', department: 'Human Resources', title: 'Recruiter', level: 5, salary: 70000, count: 3 },
    
    // Technology Staff
    { managerId: 'emp_62', department: 'Technology', title: 'Software Engineer', level: 5, salary: 95000, count: 15 },
    { managerId: 'emp_65', department: 'Technology', title: 'Product Analyst', level: 5, salary: 85000, count: 8 },
    { managerId: 'emp_67', department: 'Technology', title: 'DevOps Engineer', level: 5, salary: 100000, count: 5 },
    
    // Marketing Staff
    { managerId: 'emp_68', department: 'Marketing', title: 'Marketing Specialist', level: 5, salary: 70000, count: 8 },
    { managerId: 'emp_69', department: 'Marketing', title: 'Content Creator', level: 5, salary: 65000, count: 6 }
  ];

  contributors.forEach(contrib => {
    for (let i = 0; i < contrib.count; i++) {
      additionalEmployees.push({
        id: `emp_${empId++}`,
        name: `Employee ${empId}`,
        title: contrib.title,
        department: contrib.department,
        managerId: contrib.managerId,
        salary: contrib.salary + (Math.random() * 15000 - 7500),
        benefits: (contrib.salary * 0.25),
        startDate: new Date(2021 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), 1),
        level: contrib.level,
        isManager: false
      });
    }
  });

  return additionalEmployees;
}

/**
 * Create assessment data for DSCH analysis
 */
export function createAssessmentData() {
  return {
    organizationId: 'org_1',
    responses: [
      {
        id: 'resp_1',
        prompt: 'How would you rate the clarity of reporting structure?',
        value: 3,
        section: 'Structure',
        tags: ['structure', 'hierarchy']
      },
      {
        id: 'resp_2', 
        prompt: 'How effective are decision-making processes?',
        value: 2,
        section: 'Process',
        tags: ['decision', 'process']
      },
      {
        id: 'resp_3',
        prompt: 'How well does communication flow across departments?',
        value: 3,
        section: 'Communication',
        tags: ['communication', 'collaboration']
      },
      {
        id: 'resp_4',
        prompt: 'How aligned are employees with organizational values?',
        value: 4,
        section: 'Culture',
        tags: ['values', 'culture']
      },
      {
        id: 'resp_5',
        prompt: 'How effective is strategic planning?',
        value: 3,
        section: 'Strategy',
        tags: ['strategy', 'planning']
      }
    ],
    metadata: {
      completedAt: new Date(),
      version: '1.0'
    }
  };
}

/**
 * Create organization metrics for DSCH analysis
 */
export function createOrganizationMetrics() {
  return {
    industry: 'Professional Services',
    size: 'Medium',
    revenue: 50000000,
    employees: 260,
    locations: 3,
    foundedYear: 2015
  };
}

export default {
  createRealisticBaseline,
  createOptimizedVariant,
  createAssessmentData,
  createOrganizationMetrics
};
