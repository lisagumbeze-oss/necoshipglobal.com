ROLE: You are a senior product designer and full-stack UI/UX architect 
specializing in logistics, SaaS dashboards, and enterprise web applications.

PRODUCT NAME: NecoShip Global
OFFICIAL COMPANY NAME: Neco Ship Global
SHORT NAME: NECO
WEBSITE: www.necoshipglobal.com
SUPPORT EMAIL: support@necoshipglobal.com
TAGLINE: "Delivered Faster. Tracked Smarter. Trusted Worldwide."
COMPANY: USA-based international courier and freight company
BRAND AESTHETIC: Premium logistics — clean, authoritative, trustworthy. 
Think FedEx meets Stripe. 

COLOR PALETTE:
  - Primary: Deep Navy #0B1F3A
  - Accent: Electric Blue #1E6BFF  
  - Secondary: Slate Gray #4A5568
  - Success: Emerald #10B981
  - Warning: Amber #F59E0B
  - Danger: Red #EF4444
  - Background: Off-White #F8FAFC
  - Dark Mode BG: #0D1117

TYPOGRAPHY:
  - Display/Headings: Sora or Clash Display (bold, modern, geometric)
  - Body: DM Sans (clean, readable at all sizes)
  - Mono/Tracking Numbers: JetBrains Mono

DESIGN SYSTEM:
  - Rounded corners: 12px cards, 8px inputs, 6px buttons
  - Shadows: Layered box-shadows, not flat
  - Icons: Lucide React icon set throughout
  - Charts: Recharts or Chart.js
  - Map: Mapbox GL or Google Maps embedded component
  - Spacing: 8pt grid system
  - Responsive: Mobile-first. All screens from 320px to 2560px.
  - Motion: Subtle entrance animations, skeleton loaders, toast 
    notifications, live data pulse indicators

=============================================================
SECTION 1 — PUBLIC MARKETING WEBSITE (unauthenticated)
=============================================================

PAGE 1.1 — HOMEPAGE
- Hero section: Full-width with animated globe or world map showing 
  shipping routes as animated dotted lines between continents.
  Overlay: Bold headline + subheadline + CTA buttons: 
  "Get a Quote" and "Track a Shipment"
- Floating search bar centered in hero: "Enter tracking number..." 
  with instant-search UX and a "Track Now" button
- Trust bar: Logos row — "As seen in / Certified by" (USPS partner, 
  IATA, ISO 9001, BBB A+ Rating, FMC Licensed)
- Services Overview: 6 cards in a grid — 
    1. Express International Air Freight  
    2. Ocean Freight (FCL & LCL)  
    3. Ground Domestic Shipping  
    4. Last-Mile Delivery  
    5. Customs Brokerage  
    6. Warehousing & Fulfillment
- How It Works: Horizontal 4-step illustrated flow:
    Step 1: Create Shipment → Step 2: We Pick Up → 
    Step 3: In-Transit Updates → Step 4: Delivered
- Live Stats Banner (animated counters):
    "2.4M+ Packages Delivered | 190+ Countries Reached | 
    99.3% On-Time Rate | 24/7 Support"
- Testimonials: Carousel with customer photo, name, country flag, 
  star rating, and quote
- Pricing Teaser: 3-column card layout — Economy / Express / Enterprise
  Each with feature list and "Get Quote" CTA
- Footer: Mega footer with columns — Company, Services, Resources, 
  Support, Social Links. Include newsletter signup. 
  Bottom bar: Copyright, Privacy Policy, Terms, Cookie Settings.

PAGE 1.2 — TRACKING PAGE (public)
- Large centered input: "Track Your Shipment" with field for 
  tracking number(s) — supports bulk (up to 10 at once)
- After submit: Real-time animated results card showing:
    → Package photo placeholder
    → Shipment status badge (color-coded): In Transit / Delivered / 
      Customs Hold / Out for Delivery / Exception
    → Progress stepper: Order Placed → Picked Up → In Transit → 
      Customs Cleared → Out for Delivery → Delivered
    → Interactive live map with animated route line showing origin → 
      current location → destination (Mapbox or Google Maps)
    → Checkpoint timeline with timestamps, location, and event type 
      (icons for each event: warehouse, airplane, truck, delivered)
    → Estimated Delivery Date (highlighted in a pill badge)
    → "Sign up for SMS/Email Alerts" prompt if unauthenticated
    → Share tracking link button
    → Download PDF summary button

PAGE 1.3 — GET A QUOTE
- Multi-step form wizard (3 steps with progress bar):
    Step 1 — Shipment Details:
      Origin country/city | Destination country/city
      Shipment type: Document / Package / Pallet / Container
      Weight (lbs/kg toggle) | Dimensions (L x W x H)
      Declared value | Commodity type (dropdown)
      Quantity
    Step 2 — Service Options:
      Recommended services cards ranked by price/speed
      Each card: carrier logo, transit days, price estimate, 
      delivery date, includes/excludes list
      Add-ons: Insurance, Signature Required, Hazmat Handling, 
      White Glove Delivery
    Step 3 — Review + Book:
      Order summary sidebar
      "Create Account to Save" or "Continue as Guest"
      Pay Now button or "Request Invoice" for enterprise

PAGE 1.4 — SERVICES PAGE
- Tabbed layout for each service category
- Each service: Hero image, description, key benefits, 
  destinations served, transit times table, related FAQ

PAGE 1.5 — ABOUT PAGE
- Company story timeline
- Leadership team cards
- Certifications & compliance logos (TSA, C-TPAT, AEO)
- Global network map showing office/hub locations as pins

PAGE 1.6 — CONTACT & SUPPORT
- Left panel: Contact form (name, email, tracking number, 
  issue type dropdown, message, file attachment)
- Right panel: Office locations with timezone clocks, 
  phone numbers by region (USA, Europe, Asia, Africa)
- Live chat widget (floating bottom-right, always visible)
- Support hours with status indicator: "We're Online Now" 
  (green pulse) or "Currently Offline — Leave a Message"

PAGE 1.7 — BLOG / RESOURCE CENTER
- Grid layout with filtering by category:
  Shipping Tips | Customs Guides | Industry News | Company Updates
- Individual article page with table of contents, read time, 
  author card, social share, related articles

PAGE 1.8 — LOCATIONS
- Interactive world map with filterable pins by service type
- Sidebar list of locations with address, hours, services offered

=============================================================
SECTION 2 — AUTHENTICATION FLOWS
=============================================================

- Login Page: Email + Password. "Sign in with Google" option.
  Forgot Password link. Link to Register.
- Register Page: Account type selector first:
    Individual / Business / Enterprise (3 visual cards)
  Then: Name, Company (if business), Email, Phone, 
  Password, Country, Accept Terms checkbox.
  Email verification step.
- Forgot Password: Email input → OTP/Magic Link sent → 
  Password reset form
- 2FA Setup Page: QR code for authenticator app + 
  backup codes download

=============================================================
SECTION 3 — USER DASHBOARD (authenticated sender/shipper)
=============================================================

LAYOUT: Left sidebar navigation (collapsible) + Top header bar 
with global search, notifications bell (badge count), 
profile avatar dropdown.

SIDEBAR MENU ITEMS:
  - Dashboard (Home)
  - My Shipments
  - Track Package
  - Create Shipment
  - Get Quote
  - Address Book
  - Billing & Invoices
  - Documents
  - Notifications
  - Support Tickets
  - API Access (for business accounts)
  - Account Settings

PAGE 3.1 — DASHBOARD HOME
- Welcome banner: "Good morning, [Name]" + today's date
- KPI cards row:
    Active Shipments | Delivered This Month | 
    Pending Clearance | Total Spent (MTD)
- Recent Shipments table (last 5): tracking #, origin, destination, 
  status badge, ETA, action buttons (Track / Download Label / Duplicate)
- Quick Actions: Large icon buttons — 
  Ship Now | Track | Get Quote | Schedule Pickup
- Notifications panel: Alert cards for shipments needing attention 
  (customs hold, delivery exception, payment due)
- Spending Chart: Bar chart — monthly spend for last 6 months
- World map widget: Dots for all currently active shipments 
  with status color coding

PAGE 3.2 — MY SHIPMENTS
- Filterable data table:
    Filters: Status | Date Range | Service Type | Destination Region
    Search bar: by tracking number, reference, recipient name
    Columns: Checkbox | Tracking # | Origin | Destination | 
    Service | Status | Created Date | ETA | Weight | Cost | Actions
    Actions per row: View | Track | Download Label | 
    Download Invoice | Duplicate | Report Issue
- Bulk actions: Select multiple → Bulk download labels / 
  Export CSV / Request pickup
- Pagination + "Rows per page" control
- Export button: CSV / Excel / PDF

PAGE 3.3 — SHIPMENT DETAIL VIEW
- Breadcrumb: My Shipments > TRK-2024-XXXXXXX
- Status hero: Big colored banner with current status + 
  last update time
- Live map: Full-width interactive map with animated route and 
  real-time carrier position dot (pulsing)
- Progress timeline (vertical): Each checkpoint with:
    Timestamp | Location | Event description | 
    Handler icon (warehouse / plane / truck / customs)
- Package info card: Weight, dimensions, declared value, 
  commodity, insurance coverage
- Recipient info card: Name, address, phone, delivery instructions
- Documents section: Commercial Invoice, Bill of Lading, 
  Customs Declaration — download each
- Notifications card: SMS/Email alert toggle for this shipment
- Support: "Report an Issue" button opens ticket form for 
  this shipment

PAGE 3.4 — CREATE SHIPMENT (multi-step)
Step 1 — From / To:
  - Sender details (pre-filled from profile / address book)
  - Recipient: Search address book OR enter new
  - Save recipient to address book checkbox
  
Step 2 — Package Details:
  - Package type: Envelope / Box / Pallet / Custom
  - Weight & dimensions with unit toggle (lbs/in vs kg/cm)
  - Add multiple packages button
  - Commodity type, HS code lookup, declared value
  - Contains: Batteries / Liquids / Hazmat toggles
  
Step 3 — Choose Service:
  - Service cards: Express Air / Economy Air / Ocean / Ground
  - Each shows: estimated transit time, price, insurance default, 
    carrier logo, departure date options
  - Add-ons checklist: Insurance, Signature, Pickup Scheduling, 
    Custom Clearance Assistance, Packaging Service
  
Step 4 — Customs & Documents:
  - Auto-generates commercial invoice (editable)
  - Upload supporting docs (drag & drop)
  - Incoterms selector (DDP, DAP, EXW, etc.)
  - Customs broker checkbox: "Use SwiftShip Customs Broker Service"
  
Step 5 — Review & Pay:
  - Full order summary card
  - Promo/discount code input
  - Payment methods: Credit Card, ACH/Bank Transfer, 
    Wallet Balance, Invoice (enterprise)
  - Terms checkbox + "Book Shipment" button
  
Post-booking: Confirmation screen with:
  - Tracking number (large, copiable)
  - Printable shipping label (PDF)
  - Estimated pickup window
  - Share tracking link button

PAGE 3.5 — ADDRESS BOOK
- Contact cards grid with search + A-Z filter
- Each card: Name, company, country flag, address, 
  phone, quick-ship button
- Add / Edit / Delete address modal
- Import contacts: CSV upload with column mapper

PAGE 3.6 — BILLING & INVOICES
- Account balance widget (for prepaid/wallet users)
- Top-up wallet button
- Invoices table: Invoice # | Date | Shipments Count | 
  Amount | Status (Paid/Due/Overdue) | Download PDF | Pay Now
- Payment methods management: Add/remove cards, 
  set default payment method
- Billing address section
- Auto-pay toggle

PAGE 3.7 — DOCUMENTS
- Folder-organized document library:
  Commercial Invoices | Customs Forms | Bills of Lading | 
  Delivery Confirmations | Certificates of Origin
- Search, date filter, download, share

PAGE 3.8 — SUPPORT TICKETS
- Ticket list: ID | Subject | Related Shipment | 
  Status (Open/In Progress/Resolved) | Created | Last Reply
- Create ticket button: Form with issue type, shipment selector, 
  description, file attachments
- Ticket detail: Threaded conversation UI (like help desk), 
  status updates, "Close Ticket" button

PAGE 3.9 — NOTIFICATIONS CENTER
- Notification feed with categories: Shipment Updates | 
  Billing | System | Promotions
- Mark all read button
- Per-notification toggle (read/unread)
- Notification preferences page: Per-event toggles for 
  Email / SMS / Push for each event type 
  (e.g., "Package Picked Up", "Customs Cleared", "Delivered")

PAGE 3.10 — API ACCESS (Business tier)
- API key management: Generate, revoke, copy key
- Webhook URL configuration
- Rate limits display
- Link to API documentation
- API usage graph (calls per day for last 30 days)

PAGE 3.11 — ACCOUNT SETTINGS
- Profile info: Name, email, phone, timezone, language, 
  profile photo upload
- Security: Change password, 2FA toggle, active sessions list, 
  "Sign out all devices" button
- Preferences: Default package units, preferred carriers, 
  notification defaults
- Business profile (if applicable): Company name, EIN, 
  DUNS number, trade license upload
- Danger zone: Delete account

=============================================================
SECTION 4 — ADMIN DASHBOARD (internal staff)
=============================================================

LAYOUT: Wider sidebar with role-based menu sections. 
Top bar includes: environment badge (LIVE), global search, 
impersonation tool ("View as User"), notification bell, 
admin profile.

ADMIN SIDEBAR SECTIONS:
  Overview
  ─ Dashboard
  ─ Live Operations Map

  Shipments
  ─ All Shipments
  ─ Create Shipment (on behalf of customer)
  ─ Exceptions & Alerts
  ─ Customs Queue

  Customers
  ─ All Customers
  ─ Customer Detail
  ─ Enterprise Accounts

  Finance
  ─ Revenue Overview
  ─ Invoices
  ─ Refunds & Disputes
  ─ Carrier Cost Reconciliation

  Operations
  ─ Pickup Scheduling
  ─ Driver & Agent Management
  ─ Warehouse Management
  ─ Carrier Integrations

  Support
  ─ All Tickets
  ─ SLA Dashboard

  Content & Marketing
  ─ Blog / CMS
  ─ Promotions & Coupons

  System
  ─ Staff & Roles
  ─ System Logs
  ─ API & Webhook Logs
  ─ Rate Card Management
  ─ Settings

PAGE 4.1 — ADMIN DASHBOARD HOME
- Top KPI strip (real-time updating every 30s):
    Today's Shipments Created | In-Transit Count | 
    Delivered Today | Exceptions | Active Support Tickets | 
    Today's Revenue
- Global Live Operations Map:
    World map with animated shipment dots
    Color by status: Blue = In Transit, Green = Delivered, 
    Red = Exception, Yellow = Customs Hold
    Click a dot → mini card with shipment summary + 
    link to full detail
    Filters: By service type, carrier, region
- Charts row:
    Shipments by status donut chart (real-time)
    Revenue trend (daily, last 30 days — line chart)
    Top destination countries (horizontal bar chart)
    Carrier volume distribution (pie chart)
- Recent Exceptions table: Shipments needing immediate attention
- Recent Support Tickets: Unassigned and high-priority
- Staff activity feed: Latest actions by agents

PAGE 4.2 — ALL SHIPMENTS (admin view)
- Super-table: All shipments across all customers
  Advanced filters: Customer | Carrier | Status | 
  Service Type | Date Range | Exception Flag | 
  Customs Status | Origin Country | Destination Country
  Bulk actions: Update Status | Assign Agent | 
  Flag Exception | Export CSV
  Each row: Tracking # | Customer | Origin | Destination | 
  Carrier | Service | Status | Exception flag icon | 
  Weight | Revenue | Actions (Edit / View / Escalate)

PAGE 4.3 — SHIPMENT DETAIL (admin)
- Everything from user shipment detail PLUS:
  - Internal notes section (not visible to customer)
  - Status override: Admin manually changes status with reason
  - Carrier raw API response log (expandable JSON viewer)
  - Assign to agent dropdown
  - Add exception flag with exception type + note
  - Customer communication: Send email/SMS directly from 
    this panel
  - Refund / credit initiation button
  - Audit trail: Every status change, admin action, 
    with timestamp and staff name

PAGE 4.4 — EXCEPTIONS & ALERTS
- Priority queue table sorted by urgency
- Exception types: Lost Package | Customs Hold | 
  Delivery Failure | Address Issue | Damage Reported | 
  Carrier Delay
- Assign to agent, set resolution deadline, 
  add internal notes
- SLA timer showing time since exception raised

PAGE 4.5 — CUSTOMS QUEUE
- Shipments pending customs clearance
- Required docs checklist per shipment
- Upload docs on behalf of customer
- Communicate with customs broker
- Status: Docs Pending / Under Review / Cleared / Rejected

PAGE 4.6 — CUSTOMER MANAGEMENT
- Customer list: Name | Type (Individual/Business/Enterprise) | 
  Country | Join Date | Total Shipments | Total Revenue | 
  Account Status | Actions
- Customer Detail Page:
    Profile info + account status toggle (Active/Suspended)
    Shipment history
    Invoice history
    Support tickets
    Internal notes
    "Login as this user" (impersonation) button
    Credit limit (enterprise) management
    Communication log (emails/SMS sent to this customer)

PAGE 4.7 — DRIVER & AGENT MANAGEMENT
- Driver/Agent list: Name | ID | Region | Status 
  (On Duty / Off Duty) | Current Assignments | Rating
- Driver Detail: Profile, assigned pickups/deliveries, 
  live GPS location on mini-map, performance stats
- Assign pickup to driver modal
- Driver availability calendar

PAGE 4.8 — RATE CARD MANAGEMENT
- Service pricing configuration by:
  Origin zone × Destination zone × Weight bracket × 
  Service type × Carrier
- Surcharges: Fuel surcharge, residential delivery, 
  remote area, dangerous goods, insurance rates
- Customer-specific rate overrides (for enterprise accounts)
- Rate effective dates — schedule future rate changes

PAGE 4.9 — STAFF & ROLES
- Staff list: Name | Email | Role | Last Login | Status
- Role management: Create/edit roles with granular 
  permissions matrix (checkboxes for each feature/action)
  Roles example: Super Admin | Operations Manager | 
  Customer Support Agent | Finance | Customs Officer | 
  Read-Only Viewer
- Invite new staff via email
- Activity log per staff member

PAGE 4.10 — REVENUE & FINANCE
- Revenue dashboard:
    MRR / ARR widgets
    Revenue by service type (stacked bar)
    Revenue by region (choropleth world map)
    Carrier cost vs. customer revenue margin analysis
- Invoices: All invoices, filter by status, bulk email, 
  bulk export
- Refunds management: Initiate refund, approve/reject 
  refund requests, refund history
- Carrier reconciliation: Upload carrier invoices, 
  auto-compare against booked shipments, flag discrepancies

PAGE 4.11 — SUPPORT TICKET DASHBOARD (admin)
- All tickets across all customers
- Assign tickets to agents
- SLA dashboard: Average first response time, 
  resolution time, SLA breach alerts
- Canned responses library (admin manages templates)
- Customer satisfaction ratings (CSAT per ticket)

PAGE 4.12 — CMS — BLOG & PROMOTIONS
- Blog post editor: Rich text editor with image upload, 
  SEO meta fields, category/tag management, 
  draft/publish/schedule
- Promo codes: Create codes (% off, $ off, free service), 
  set usage limits, expiry dates, eligible services, 
  usage report table

PAGE 4.13 — SYSTEM LOGS & API
- Inbound/outbound API call logs with status codes, 
  latency, payload viewer
- Webhook delivery logs with retry controls
- Carrier integration health: Status indicators for each 
  integrated carrier API (FedEx, DHL, UPS, USPS, etc.)
- System event log (user logins, admin actions, 
  status changes — full audit trail)

=============================================================
SECTION 5 — ADDITIONAL COMPONENTS & MICRO-UX DETAILS
=============================================================

GLOBAL COMPONENTS:
- Floating live chat widget (bottom-right): 
  Shows agent name + avatar when online
- Cookie consent banner (GDPR/CCPA compliant)
- Toast notifications system (success/error/warning/info)
- Skeleton loaders for all data tables and cards
- Empty states: Illustrated empty state for 
  "No shipments yet", "No notifications", etc.
- Error pages: Custom 404, 500, Maintenance Mode pages
- Onboarding: New user welcome modal with 3-step 
  product tour tooltips
- Dark Mode: Full dark mode support with toggle in 
  header and settings

RESPONSIVE REQUIREMENTS:
- Mobile (320–767px): Stacked single column, 
  bottom navigation bar for user dashboard
- Tablet (768–1023px): 2-column layouts, 
  collapsible sidebar
- Desktop (1024px+): Full sidebar + multi-column layouts
- Wide (1440px+): Max-width containers, 
  expanded data density

ACCESSIBILITY:
- WCAG 2.1 AA compliant
- Focus rings on all interactive elements
- ARIA labels on icons and custom components
- Color contrast minimum 4.5:1
- Keyboard navigable modals and dropdowns

LOADING & PERFORMANCE UX:
- Skeleton screens (not spinners) for all data loads
- Optimistic UI updates on status changes
- Infinite scroll OR pagination on all tables 
  (admin-configurable)
- Debounced search inputs (300ms)
- Pull-to-refresh on mobile

=============================================================
DESIGN DELIVERABLES REQUESTED FROM AI UI BUILDER:
=============================================================

1. Complete design system / component library:
   Buttons, inputs, selects, modals, toasts, badges, 
   tables, cards, tabs, steppers, avatars, tooltips, 
   dropdowns, date pickers, file uploaders

2. All public pages (Section 1): Desktop + mobile

3. Auth flows (Section 2): All screens, all states

4. Full user dashboard (Section 3): All pages, 
   desktop + mobile, all interactive states 
   (loading, empty, error, success)

5. Full admin dashboard (Section 4): All pages, 
   desktop only (primary), tablet (secondary)

6. Interactive prototype connections between:
   - Homepage → Tracking Result
   - Homepage → Get Quote → Booking Confirmation
   - Login → User Dashboard
   - User: Create Shipment full flow
   - Admin: Shipment exception resolution flow

7. Export: All assets in organized Figma frames 
   OR component-based HTML/CSS/React code

=============================================================
TECHNICAL STACK HINT (for code-generating AI builders):
=============================================================
Frontend: Next.js 14 (App Router) + TypeScript
Styling: Tailwind CSS + shadcn/ui component library
Charts: Recharts
Map: Mapbox GL JS
Icons: Lucide React
Auth: NextAuth.js or Clerk
State: Zustand + React Query
Animations: Framer Motion
Tables: TanStack Table v8
Forms: React Hook Form + Zod validation
Real-time: Pusher or Supabase Realtime
PDF Generation: React-PDF