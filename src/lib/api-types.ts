// ─── Auth ────────────────────────────────────────────
export interface RegisterRequest {
  email: string;
  password: string;
  password_confirmation: string;
  full_name: string;
  phone?: string | null;
}

export interface RegisterResponse {
  user_id: number;
  access_token: string;
  refresh_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
  password_confirmation: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// ─── Profile / Account ──────────────────────────────
export interface ProfileResponse {
  id: number;
  email: string;
  full_name: string;
  phone: string | null;
  profile_image_url: string | null;
  role: string;
  is_active: boolean;
  is_anonymized: boolean;
  created_at: string;
}

export interface ProfileUpdateRequest {
  full_name?: string | null;
  phone?: string | null;
  profile_image_url?: string | null;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}

export interface PersonalDataExport {
  email: string;
  full_name: string;
  phone: string | null;
  quotes: unknown[];
  jobs: unknown[];
  invoices: unknown[];
  support_tickets: unknown[];
  created_at: string;
}

export interface DeleteResponse {
  message: string;
}

// ─── Quotes ─────────────────────────────────────────
export interface PresignedUrlResponse {
  url: string;
  fields?: Record<string, unknown> | null;
}

export interface QuoteRequestCreate {
  move_type: string;
  address_from: string;
  address_to: string;
  description: string;
  video_url?: string | null;
  contact_name?: string | null;
  company?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  move_date?: string | null;
  delivery_date?: string | null;
  storage_size?: string | null;
  freight_weight?: string | null;
  additional_services?: string[] | null;
}

export interface QuoteCounterOfferResponse {
  id: number;
  offered_by: number;
  offered_by_name?: string | null;
  amount: string;
  message?: string | null;
  created_at: string;
}

export interface QuoteResponse {
  id: number;
  quote_number: string;
  total_price: string;
  amount: string;
  valid_until: string;
  status: string;
  pdf_url?: string | null;
  quote_request_id?: number | null;
  job_id?: number | null;
  tracking_token?: string | null;
  contract_id?: number | null;
  contract_status?: string | null;
  invoice_id?: number | null;
  invoice_number?: string | null;
  invoice_status?: string | null;
  counter_offers: QuoteCounterOfferResponse[];
}


export interface QuoteResponse {
  id: number;
  quote_number: string;
  move_type: string;
  created_at: string;
  total_price: string;
  valid_until: string;
  status: string;
  pdf_url?: string | null;
}

export interface QuoteAcceptResponse {
  contract_id: number;
  contract_status: string;
  signing_token?: string | null;
  message?: string;
}
export interface QuoteRejectResponse {
  quote_id: number;
  status: string;
  message: string;
}

// ─── Jobs ───────────────────────────────────────────
export interface JobResponse {
  id: number;
  status: string;
  tracking_token: string;
  scheduled_start?: string | null;
  scheduled_end?: string | null;
  photos?: unknown[] | null;
}

export interface StatusUpdateRequest {
  status: "in_progress" | "completed";
  notes?: string | null;
}

export interface ScheduleRequest {
  scheduled_start: string;
  scheduled_end: string;
  crew_ids?: number[] | null;
}

export interface TrackingResponse {
  status: string;
  history: StatusHistoryItem[];
  scheduled_start?: string | null;
  scheduled_end?: string | null;
  photos?: unknown[] | null;
}

export interface StatusHistoryItem {
  status: string;
  timestamp?: string | null;
  created_at: string;
  notes?: string | null;
}

// ─── Invoices ───────────────────────────────────────
export interface InvoiceResponse {
  id: number;
  invoice_number: string;
  total_amount: string;
  status: string;
  invoice_type: string;
  pdf_url?: string | null;
  created_at: string;
}

export interface PayResponse {
  checkout_url: string;
  payment_id: string;
}

// ─── Dashboard (Admin) ──────────────────────────────
export interface DashboardJob {
  id: number;
  customer_name: string;
  status: string;
  scheduled_start?: string | null;
  address_from?: string | null;
  address_to?: string | null;
}

export interface DashboardResponse {
  today_jobs: DashboardJob[];
  upcoming_jobs: DashboardJob[];
  overdue_jobs: DashboardJob[];
  total_active: number;
}

// ─── Support ────────────────────────────────────────
export interface TicketCreate {
  email: string;
  subject: string;
  message: string;
}

export interface TicketResponse {
  id: number;
  message: string;
}

// ─── Webhook ────────────────────────────────────────
export interface MollieWebhookPayload {
  id: string;
}