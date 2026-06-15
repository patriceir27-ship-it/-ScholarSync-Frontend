/**
 * ============================================================================
 * CHANCEN INTERNATIONAL RWANDA - UNIFIED TYPE DEFINITIONS
 * ============================================================================
 * Shared TypeScript types for backend and frontend
 * Use in both environments for type safety and consistency
 */

// ============================================================================
// USER & AUTHENTICATION TYPES
// ============================================================================

export type UserRole = 'admin' | 'recruiter' | 'student' | 'finance_officer' | 'institution_partner';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'deleted';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  profile_image_url?: string;
  date_of_birth?: Date;
  role: UserRole;
  status: UserStatus;
  email_verified: boolean;
  email_verified_at?: Date;
  two_factor_enabled: boolean;
  last_login_at?: Date;
  profile_data?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface UserProfile extends User {
  // Additional profile data based on role
  institution_id?: string; // for institution partners
  recruiter_organization?: string; // for recruiters
}

export interface AuthRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// ============================================================================
// APPLICATION & SCREENING TYPES
// ============================================================================

export type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'screening_completed'
  | 'accepted'
  | 'rejected'
  | 'waitlisted'
  | 'withdrawn';

export type SocioeconomicLevel = 'low' | 'medium' | 'high';

export interface ApplicationDocument {
  filename: string;
  s3_url: string;
  document_type: string; // 'transcript', 'id', 'proof_of_income', etc.
  uploaded_at: Date;
  file_size_bytes?: number;
}

export interface Application {
  id: string;
  user_id: string;
  program_id: string;
  program_name?: string;
  institution_name?: string;
  status: ApplicationStatus;
  academic_score?: number;
  academic_score_out_of?: number;
  personal_statement?: string;
  motivation_statement?: string;
  socioeconomic_level?: SocioeconomicLevel;
  household_monthly_income?: number;
  dependents_count?: number;
  disability_status?: boolean;
  previous_institution?: string;
  previous_gpa?: number;
  documents?: ApplicationDocument[];
  submitted_at?: Date;
  screening_triggered_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ApplicationWithScreening extends Application {
  screening_result?: ScreeningResult;
}

// ============================================================================
// SCREENING & RULE ENGINE TYPES
// ============================================================================

export type ScreeningRecommendation = 'accept' | 'review' | 'reject';
export type RuleStatus = 'draft' | 'active' | 'inactive' | 'archived';
export type RuleOperator = 'equals' | '!=' | '>' | '>=' | '<' | '<=' | 'in' | 'not_in' | 'contains' | 'range';

export interface RuleCondition {
  field: string;
  operator: RuleOperator;
  value: any;
  weight?: number;
}

export interface RuleDefinition {
  conditions: RuleCondition[];
  weight: number;
  impact: 'positive' | 'negative' | 'neutral';
  description?: string;
}

export interface Rule {
  id: string;
  name: string;
  description?: string;
  rule_definition: RuleDefinition;
  status: RuleStatus;
  weight: number;
  priority: number;
  applies_to_programs?: string[];
  enabled: boolean;
  execution_order?: number;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  last_executed_at?: Date;
  execution_count?: number;
}

export interface ReasoningBreakdown {
  rule_scores?: Array<{
    rule_id: string;
    rule_name: string;
    score: number;
    passed: boolean;
  }>;
  ai_factors?: Array<{
    factor: string;
    score: number;
    explanation: string;
  }>;
}

export interface ScreeningResult {
  id: string;
  application_id: string;
  rule_evaluation_score?: number; // 0-100
  ai_ranking_score?: number;      // 0-100
  final_score?: number;           // weighted average
  recommendation: ScreeningRecommendation;
  confidence_level?: number;      // 0-100
  explanation: string;
  reasoning_breakdown?: ReasoningBreakdown;
  reviewed_by?: string;
  review_notes?: string;
  reviewed_at?: Date;
  screened_at: Date;
  screening_method: 'rules_only' | 'ai_only' | 'hybrid';
  processing_time_ms?: number;
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// STUDENT & LIFECYCLE TYPES
// ============================================================================

export type StudentAcademicStatus = 'active' | 'on_track' | 'at_risk' | 'on_probation' | 'graduated' | 'withdrawn';
export type EmploymentStatus = 'not_employed' | 'employed_full_time' | 'employed_part_time' | 'self_employed' | 'pursuing_further_studies' | 'unknown';
export type ProgramLevel = 'certificate' | 'diploma' | 'bachelor' | 'master';

export interface Student {
  id: string;
  user_id: string;
  application_id?: string;
  enrollment_date: Date;
  enrollment_cohort?: string;
  program_name: string;
  program_level: ProgramLevel;
  institution_name: string;
  expected_graduation_date?: Date;
  current_gpa?: number;
  total_credits_enrolled?: number;
  total_credits_completed?: number;
  academic_status: StudentAcademicStatus;
  is_on_track?: boolean;
  at_risk_flags?: string[];
  employment_status: EmploymentStatus;
  employment_date?: Date;
  employer_name?: string;
  job_title?: string;
  employment_sector?: string;
  current_salary?: number;
  salary_currency: string;
  last_income_verified_date?: Date;
  current_location?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AcademicProgress {
  id: string;
  student_id: string;
  semester: string;
  year: number;
  gpa: number;
  credits_earned: number;
  courses_passed: number;
  courses_failed: number;
  courses_retaken?: number;
  attendance_percentage?: number;
  notes?: string;
  recorded_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface EmploymentHistory {
  id: string;
  student_id: string;
  status: EmploymentStatus;
  employer_name?: string;
  job_title?: string;
  employment_sector?: string;
  monthly_salary?: number;
  salary_currency: string;
  employment_start_date?: Date;
  employment_end_date?: Date;
  verification_status: 'pending' | 'verified' | 'disputed' | 'rejected';
  verified_by?: string;
  verified_at?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// ISA (INCOME SHARE AGREEMENT) TYPES
// ============================================================================

export type IsaStatus = 'pending' | 'active' | 'suspended' | 'completed' | 'defaulted' | 'cancelled';
export type PaymentVerificationStatus = 'pending' | 'verified' | 'disputed' | 'rejected';

export interface ISAAgreement {
  id: string;
  student_id: string;
  amount_financed: number;
  monthly_salary_threshold: number; // typically 80,000 RWF
  repayment_percentage: number; // e.g., 0.10 for 10%
  maximum_repayment_period_months?: number; // typically 360 (30 years)
  status: IsaStatus;
  started_at?: Date;
  completed_at?: Date;
  total_repaid: number;
  repayment_percentage_applied?: number;
  agreement_document_url?: string;
  created_by?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ISAPayment {
  id: string;
  agreement_id: string;
  student_id: string;
  payment_amount: number;
  payment_date: Date;
  payment_method?: string; // 'bank_transfer', 'mobile_money', 'check'
  payment_currency: string;
  income_reported: number;
  income_currency: string;
  verification_status: PaymentVerificationStatus;
  verified_by?: string;
  verified_at?: Date;
  verification_notes?: string;
  batch_id?: string;
  batch_processed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ISASuspension {
  id: string;
  agreement_id: string;
  reason: string; // 'income_below_threshold', 'unemployment', 'hardship', etc.
  suspended_at: Date;
  resumed_at?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ISASummary {
  student_id: string;
  full_name: string;
  email: string;
  program_name: string;
  isa_status: IsaStatus;
  amount_financed: number;
  total_repaid: number;
  remaining_balance: number;
  repayment_percentage: number;
  employment_status: EmploymentStatus;
  current_salary?: number;
  income_status: 'above_threshold' | 'below_threshold' | 'not_verified';
  months_until_completion?: number;
}

// ============================================================================
// PROGRAM TYPES
// ============================================================================

export interface Program {
  id: string;
  code: string;
  name: string;
  description?: string;
  institution_id?: string;
  level: ProgramLevel;
  duration_months?: number;
  sector?: string; // 'technology', 'healthcare', 'agriculture', etc.
  minimum_academic_score?: number;
  preferred_academic_score?: number;
  intake_capacity?: number;
  default_isa_amount?: number;
  default_repayment_percentage?: number;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// ANALYTICS & STATISTICS TYPES
// ============================================================================

export interface ApplicationStatistics {
  date: Date;
  total_applications: number;
  applications_submitted: number;
  applications_screened: number;
  applications_accepted: number;
  applications_rejected: number;
  average_screening_score?: number;
  average_processing_time_hours?: number;
}

export interface CohortStatistics {
  cohort_name: string;
  enrollment_date: Date;
  enrollment_count: number;
  completion_rate: number; // percentage
  employment_rate: number; // percentage
  isa_completion_rate: number; // percentage
  average_time_to_employment_months?: number;
  average_salary?: number;
}

export interface ScreeningMetrics {
  total_screened: number;
  accepted: number;
  rejected: number;
  under_review: number;
  average_score: number;
  confidence_level: number;
  processing_time_avg_ms: number;
  rule_matching_accuracy?: number;
  ai_recommendation_accuracy?: number;
}

export interface EmploymentMetrics {
  total_students: number;
  employed: number;
  employment_rate: number;
  average_salary: number;
  salary_range: {
    min: number;
    max: number;
  };
  by_sector?: Record<string, number>;
  time_to_employment_avg_months: number;
}

export interface ISAMetrics {
  total_agreements: number;
  active_agreements: number;
  completed_agreements: number;
  total_financed: number;
  total_repaid: number;
  average_repayment_time_months?: number;
  defaulted_count?: number;
  completion_rate: number;
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  timestamp: Date;
}

// ============================================================================
// FILTERING & SEARCH TYPES
// ============================================================================

export interface ApplicationFilter {
  status?: ApplicationStatus[];
  program_id?: string;
  academic_score_min?: number;
  academic_score_max?: number;
  socioeconomic_level?: SocioeconomicLevel[];
  submitted_date_from?: Date;
  submitted_date_to?: Date;
  search?: string; // full-text search
}

export interface StudentFilter {
  cohort?: string;
  academic_status?: StudentAcademicStatus[];
  employment_status?: EmploymentStatus[];
  salary_min?: number;
  salary_max?: number;
  program_name?: string;
}

export interface RuleFilter {
  status?: RuleStatus[];
  enabled?: boolean;
  program_id?: string;
}

// ============================================================================
// AI/GEMINI REQUEST/RESPONSE TYPES
// ============================================================================

export interface AIScreeningRequest {
  application_id: string;
  application_data: {
    academic_score: number;
    socioeconomic_level: string;
    household_income: number;
    program_preference: string;
    personal_statement: string;
    previous_gpa?: number;
    employment_history?: string;
  };
  context: {
    program_tier?: string;
    institution_selectivity?: string;
    cohort_size?: number;
    target_demographics?: string[];
  };
}

export interface AIScreeningResponse {
  ranking_score: number; // 0-100
  recommendation: ScreeningRecommendation;
  factors: Array<{
    factor: string;
    contribution: number; // percentage contribution to score
    sentiment: 'positive' | 'neutral' | 'negative';
    explanation: string;
  }>;
  risk_flags?: string[];
  opportunities?: string[];
  reasoning: string;
  model_version?: string;
}

// ============================================================================
// AUDIT & LOGGING TYPES
// ============================================================================

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  timestamp: Date;
}

// ============================================================================
// SYSTEM CONFIGURATION TYPES
// ============================================================================

export interface SystemConfig {
  id: string;
  key: string;
  value: Record<string, any>;
  description?: string;
  updated_by?: string;
  updated_at: Date;
}

// ============================================================================
// EXPORT TYPES FOR EASE OF USE
// ============================================================================

export type AllTypes = {
  User: User;
  Application: Application;
  Student: Student;
  ISAAgreement: ISAAgreement;
  Rule: Rule;
  ScreeningResult: ScreeningResult;
  Program: Program;
  // ... add more as needed
};
