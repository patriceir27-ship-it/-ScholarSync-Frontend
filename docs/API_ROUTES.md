/**
 * ============================================================================
 * CHANCEN API ROUTES - COMPLETE REFERENCE
 * ============================================================================
 * RESTful API endpoints for the Chancen system
 * Base URL: /api/v1
 * All endpoints require JWT token in Authorization header (except auth routes)
 */

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

/**
 * POST /api/v1/auth/register
 * Register a new user account
 *
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "password": "SecurePass123!",
 *   "full_name": "John Doe",
 *   "role": "student",
 *   "phone_number": "+250786123456" (optional)
 * }
 *
 * Response: 201 Created
 * {
 *   "success": true,
 *   "data": {
 *     "id": "usr_123456",
 *     "email": "user@example.com",
 *     "full_name": "John Doe",
 *     "role": "student",
 *     "status": "active",
 *     "created_at": "2024-01-15T10:30:00Z"
 *   }
 * }
 */

/**
 * POST /api/v1/auth/login
 * Authenticate user and receive JWT tokens
 *
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "password": "SecurePass123!",
 *   "rememberMe": true (optional)
 * }
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "user": { ...user object },
 *     "access_token": "eyJhbGciOiJIUzI1NiIs...",
 *     "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
 *     "expires_in": 604800
 *   }
 * }
 */

/**
 * POST /api/v1/auth/refresh
 * Refresh access token using refresh token
 *
 * Headers:
 * Authorization: Bearer <refresh_token>
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "access_token": "eyJhbGciOiJIUzI1NiIs...",
 *     "expires_in": 604800
 *   }
 * }
 */

/**
 * POST /api/v1/auth/logout
 * Invalidate tokens and logout user
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "message": "Logged out successfully"
 * }
 */

/**
 * POST /api/v1/auth/forgot-password
 * Request password reset token
 *
 * Request Body:
 * {
 *   "email": "user@example.com"
 * }
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "message": "Reset link sent to email"
 * }
 */

/**
 * POST /api/v1/auth/reset-password
 * Reset password with token
 *
 * Request Body:
 * {
 *   "reset_token": "rst_123456789",
 *   "new_password": "NewSecurePass123!"
 * }
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "message": "Password reset successfully"
 * }
 */

// ============================================================================
// APPLICATION ROUTES
// ============================================================================

/**
 * POST /api/v1/applications
 * Create new draft application
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Request Body:
 * {
 *   "program_id": "prog_001",
 *   "academic_score": 85.5
 * }
 *
 * Response: 201 Created
 * {
 *   "success": true,
 *   "data": {
 *     "id": "app_123456",
 *     "user_id": "usr_789",
 *     "program_id": "prog_001",
 *     "status": "draft",
 *     "academic_score": 85.5,
 *     "created_at": "2024-01-15T10:30:00Z"
 *   }
 * }
 */

/**
 * GET /api/v1/applications/:id
 * Get application details
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": { ...application object }
 * }
 */

/**
 * PUT /api/v1/applications/:id
 * Update draft application
 *
 * Headers:
 * Authorization: Bearer <access_token>
 * Content-Type: application/json
 *
 * Request Body:
 * {
 *   "academic_score": 88,
 *   "personal_statement": "My background...",
 *   "socioeconomic_level": "low"
 * }
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": { ...updated application object }
 * }
 */

/**
 * POST /api/v1/applications/:id/submit
 * Submit application for review (changes status from draft to submitted)
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "id": "app_123456",
 *     "status": "submitted",
 *     "submitted_at": "2024-01-15T10:30:00Z"
 *   }
 * }
 */

/**
 * POST /api/v1/applications/:id/upload-document
 * Upload supporting document for application
 *
 * Headers:
 * Authorization: Bearer <access_token>
 * Content-Type: multipart/form-data
 *
 * Form Data:
 * {
 *   "file": <binary file>,
 *   "document_type": "transcript" // transcript, id, proof_of_income, etc.
 * }
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "filename": "transcript.pdf",
 *     "s3_url": "https://s3.example.com/...",
 *     "document_type": "transcript",
 *     "uploaded_at": "2024-01-15T10:30:00Z"
 *   }
 * }
 */

/**
 * GET /api/v1/applications
 * List user's applications (student) or all applications (admin/recruiter)
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Query Parameters:
 * - status: comma-separated list (submitted, accepted, rejected)
 * - program_id: filter by program
 * - page: 1
 * - per_page: 20
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "data": [...applications],
 *     "total": 150,
 *     "page": 1,
 *     "per_page": 20,
 *     "total_pages": 8
 *   }
 * }
 */

// ============================================================================
// ADMIN - SCREENING & DECISION ROUTES
// ============================================================================

/**
 * GET /api/v1/admin/applications/pending
 * Get list of applications pending screening (admin/recruiter only)
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Query Parameters:
 * - sort_by: academic_score, submitted_date
 * - order: asc, desc
 * - limit: 20
 * - offset: 0
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "app_123",
 *       "program_name": "Bachelor of Computer Science",
 *       "academic_score": 85,
 *       "socioeconomic_level": "low",
 *       "submitted_at": "2024-01-10T08:00:00Z",
 *       "status": "submitted"
 *     }
 *   ]
 * }
 */

/**
 * POST /api/v1/admin/applications/:id/screen
 * Trigger screening for an application (rules + AI)
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Query Parameters:
 * - method: "hybrid" (rules_only, ai_only, hybrid)
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "id": "scr_456",
 *     "application_id": "app_123",
 *     "rule_evaluation_score": 82.5,
 *     "ai_ranking_score": 79.0,
 *     "final_score": 80.75,
 *     "recommendation": "accept",
 *     "confidence_level": 0.87,
 *     "reasoning": "Strong academic performance with good motivation alignment..."
 *   }
 * }
 */

/**
 * GET /api/v1/admin/applications/:id/screening
 * Get screening result for application
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": { ...screening result object }
 * }
 */

/**
 * POST /api/v1/admin/applications/:id/decide
 * Make final decision on application (admin only)
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Request Body:
 * {
 *   "decision": "accepted", // accepted, rejected, waitlisted
 *   "notes": "Strong candidate with demonstrated commitment",
 *   "send_email_notification": true
 * }
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "application_id": "app_123",
 *     "decision": "accepted",
 *     "decided_at": "2024-01-15T10:30:00Z"
 *   }
 * }
 */

// ============================================================================
// ADMIN - RULE MANAGEMENT ROUTES
// ============================================================================

/**
 * GET /api/v1/admin/rules
 * List all screening rules
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Query Parameters:
 * - status: active, draft, archived
 * - enabled: true, false
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "rule_1",
 *       "name": "Minimum Academic Score",
 *       "status": "active",
 *       "weight": 1.0,
 *       "rule_definition": { ... },
 *       "created_at": "2024-01-10T08:00:00Z"
 *     }
 *   ]
 * }
 */

/**
 * POST /api/v1/admin/rules
 * Create new screening rule
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Request Body:
 * {
 *   "name": "High Academic Achievers",
 *   "description": "Accept students with score >= 80",
 *   "rule_definition": {
 *     "conditions": [
 *       {
 *         "field": "academic_score",
 *         "operator": ">=",
 *         "value": 80
 *       }
 *     ],
 *     "weight": 1.5,
 *     "impact": "positive"
 *   },
 *   "applies_to_programs": ["prog_001", "prog_002"]
 * }
 *
 * Response: 201 Created
 * {
 *   "success": true,
 *   "data": { ...rule object with id }
 * }
 */

/**
 * PUT /api/v1/admin/rules/:id
 * Update screening rule
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Request Body: (same as POST)
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": { ...updated rule object }
 * }
 */

/**
 * DELETE /api/v1/admin/rules/:id
 * Delete screening rule (admin only)
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "message": "Rule deleted"
 * }
 */

/**
 * POST /api/v1/admin/rules/:id/test
 * Test rule with sample applications before deployment
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Request Body:
 * {
 *   "sample_application_ids": ["app_1", "app_2", "app_3"]
 * }
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "rule_name": "High Academic Achievers",
 *     "total_samples": 100,
 *     "matching_count": 45,
 *     "match_percentage": 45.0,
 *     "recommendations": ["Rule is well-balanced..."]
 *   }
 * }
 */

// ============================================================================
// STUDENT MONITORING ROUTES
// ============================================================================

/**
 * GET /api/v1/students/:id/progress
 * Get student's academic progress
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "student_id": "std_123",
 *     "program_name": "Bachelor of Computer Science",
 *     "current_gpa": 3.5,
 *     "total_credits": 120,
 *     "completed_credits": 90,
 *     "academic_status": "on_track",
 *     "progress_percentage": 75,
 *     "recent_progress": [
 *       {
 *         "semester": "2024_1",
 *         "gpa": 3.6,
 *         "credits": 15
 *       }
 *     ]
 *   }
 * }
 */

/**
 * GET /api/v1/students/:id/employment
 * Get student's employment status
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "student_id": "std_123",
 *     "employment_status": "employed_full_time",
 *     "employer_name": "Tech Company Ltd",
 *     "job_title": "Software Developer",
 *     "employment_sector": "technology",
 *     "monthly_salary": 2500000,
 *     "employment_date": "2023-06-01",
 *     "employment_history": [...]
 *   }
 * }
 */

/**
 * GET /api/v1/students/:id/isa-status
 * Get student's ISA repayment status
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "student_id": "std_123",
 *     "amount_financed": 5000000,
 *     "total_repaid": 1250000,
 *     "remaining_balance": 3750000,
 *     "repayment_percentage": 25.0,
 *     "isa_status": "active",
 *     "monthly_payment": 250000,
 *     "income_status": "above_threshold",
 *     "projected_completion_date": "2027-06-01"
 *   }
 * }
 */

// ============================================================================
// ANALYTICS ROUTES
// ============================================================================

/**
 * GET /api/v1/analytics/cohort
 * Get cohort analysis and statistics
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Query Parameters:
 * - cohort: cohort_2024_1
 * - include_metrics: employment, isa, academic
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "cohort_name": "cohort_2024_1",
 *     "enrollment_count": 150,
 *     "completion_rate": 0.92,
 *     "employment_rate": 0.88,
 *     "average_salary": 2100000,
 *     "isa_completion_rate": 0.65
 *   }
 * }
 */

/**
 * GET /api/v1/analytics/employment
 * Get employment statistics
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "total_graduates": 500,
 *     "employed": 440,
 *     "employment_rate": 0.88,
 *     "average_salary": 2150000,
 *     "salary_range": { "min": 800000, "max": 5000000 },
 *     "by_sector": { "technology": 180, "finance": 120, ... },
 *     "time_to_employment_avg_months": 2.5
 *   }
 * }
 */

/**
 * GET /api/v1/analytics/isa-performance
 * Get ISA repayment performance metrics
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "total_agreements": 450,
 *     "active_agreements": 380,
 *     "completed_agreements": 65,
 *     "total_financed": 2250000000,
 *     "total_repaid": 562500000,
 *     "completion_rate": 0.14,
 *     "average_repayment_time_months": 36,
 *     "at_risk_count": 12
 *   }
 * }
 */

/**
 * GET /api/v1/analytics/impact
 * Get overall impact metrics
 *
 * Headers:
 * Authorization: Bearer <access_token>
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "total_students_financed": 2150,
 *     "total_amount_financed": 10750000000,
 *     "graduates": 1850,
 *     "employed_graduates": 1628,
 *     "employment_rate": 0.88,
 *     "isa_agreements_completed": 95,
 *     "total_income_gained_for_graduates": 850000000000,
 *     "average_salary_increase": 1200000
 *   }
 * }
 */

// ============================================================================
// ERROR RESPONSES
// ============================================================================

/**
 * All endpoints return consistent error responses
 *
 * 400 Bad Request:
 * {
 *   "success": false,
 *   "error": "Invalid input data",
 *   "code": "VALIDATION_ERROR",
 *   "timestamp": "2024-01-15T10:30:00Z"
 * }
 *
 * 401 Unauthorized:
 * {
 *   "success": false,
 *   "error": "Token expired or invalid",
 *   "code": "UNAUTHORIZED",
 *   "timestamp": "2024-01-15T10:30:00Z"
 * }
 *
 * 403 Forbidden:
 * {
 *   "success": false,
 *   "error": "Insufficient permissions",
 *   "code": "FORBIDDEN",
 *   "timestamp": "2024-01-15T10:30:00Z"
 * }
 *
 * 404 Not Found:
 * {
 *   "success": false,
 *   "error": "Resource not found",
 *   "code": "NOT_FOUND",
 *   "timestamp": "2024-01-15T10:30:00Z"
 * }
 *
 * 500 Internal Server Error:
 * {
 *   "success": false,
 *   "error": "Internal server error",
 *   "code": "INTERNAL_ERROR",
 *   "timestamp": "2024-01-15T10:30:00Z"
 * }
 */
