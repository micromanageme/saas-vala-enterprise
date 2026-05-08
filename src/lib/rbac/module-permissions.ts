/**
 * SaaS Vala Enterprise - Module Permission Mappings
 * Maps existing modules to RBAC permissions
 */

import { modules } from '../modules';

export interface ModulePermission {
  module: string;
  url: string;
  permission: string;
  roles: string[];
}

export const modulePermissions: ModulePermission[] = [
  // Overview
  { module: 'Welcome', url: '/welcome', permission: 'dashboard.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales', 'crm', 'hr', 'inventory', 'marketplace_vendor', 'reseller', 'affiliate', 'customer', 'billing', 'analytics', 'support', 'security', 'ai_manager', 'api_manager'] },
  { module: 'AI Dashboard', url: '/dashboard', permission: 'dashboard.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales', 'crm', 'hr', 'inventory', 'billing', 'analytics', 'support', 'security', 'ai_manager', 'api_manager'] },
  { module: 'Executive', url: '/executive', permission: 'executive.view', roles: ['super_admin', 'erp_admin', 'admin'] },
  { module: 'Live Analytics', url: '/live', permission: 'live.view', roles: ['super_admin', 'erp_admin', 'admin', 'analytics', 'ai_manager'] },
  { module: 'Calendar', url: '/calendar', permission: 'calendar.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales', 'crm', 'hr', 'inventory', 'support', 'ai_manager'] },
  { module: 'Activity', url: '/activity', permission: 'activity.view', roles: ['super_admin', 'erp_admin', 'admin'] },
  { module: 'Favorites', url: '/favorites', permission: 'favorites.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales', 'crm', 'hr', 'inventory', 'marketplace_vendor', 'reseller', 'affiliate', 'customer', 'billing', 'analytics', 'support', 'security', 'ai_manager', 'api_manager'] },
  { module: 'Bookmarks', url: '/bookmarks', permission: 'bookmarks.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales', 'crm', 'hr', 'inventory', 'marketplace_vendor', 'reseller', 'affiliate', 'customer', 'billing', 'analytics', 'support', 'security', 'ai_manager', 'api_manager'] },
  { module: 'Goals', url: '/goals', permission: 'goals.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales_manager', 'sales', 'crm_manager', 'crm', 'hr_manager', 'hr', 'inventory_manager', 'billing', 'analytics', 'ai_manager'] },

  // Sales
  { module: 'CRM', url: '/crm', permission: 'crm.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales_manager', 'sales', 'crm_manager', 'crm', 'billing', 'analytics'] },
  { module: 'Sales / ERP', url: '/erp', permission: 'erp.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales_manager', 'sales', 'billing', 'analytics'] },
  { module: 'POS', url: '/pos', permission: 'pos.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales_manager', 'sales', 'inventory_manager', 'inventory'] },
  { module: 'Marketplace', url: '/marketplace', permission: 'marketplace.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales_manager', 'marketplace_vendor', 'reseller', 'affiliate', 'customer'] },
  { module: 'Subscriptions', url: '/subscriptions', permission: 'subscriptions.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales_manager', 'billing', 'customer'] },

  // Finance
  { module: 'Accounting', url: '/accounting', permission: 'accounting.view', roles: ['super_admin', 'erp_admin', 'admin', 'billing', 'analytics'] },
  { module: 'Invoices', url: '/invoices', permission: 'invoices.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales_manager', 'sales', 'billing', 'customer'] },

  // Operations
  { module: 'Inventory', url: '/inventory', permission: 'inventory.view', roles: ['super_admin', 'erp_admin', 'admin', 'inventory_manager', 'inventory', 'sales_manager', 'sales', 'marketplace_vendor'] },
  { module: 'Manufacturing', url: '/manufacturing', permission: 'manufacturing.view', roles: ['super_admin', 'erp_admin', 'admin', 'inventory_manager', 'inventory'] },
  { module: 'Projects', url: '/projects', permission: 'projects.view', roles: ['super_admin', 'erp_admin', 'admin', 'hr_manager', 'hr', 'inventory_manager', 'inventory', 'sales_manager', 'sales'] },

  // People
  { module: 'HRM', url: '/hrm', permission: 'hrm.view', roles: ['super_admin', 'erp_admin', 'admin', 'hr_manager', 'hr'] },
  { module: 'Recruitment', url: '/recruitment', permission: 'recruitment.view', roles: ['super_admin', 'erp_admin', 'admin', 'hr_manager', 'hr'] },

  // Partners
  { module: 'Licenses', url: '/licenses', permission: 'licenses.view', roles: ['super_admin', 'erp_admin', 'admin', 'api_manager', 'reseller', 'affiliate', 'customer'] },
  { module: 'Resellers', url: '/resellers', permission: 'resellers.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales_manager', 'sales', 'reseller'] },
  { module: 'Franchises', url: '/franchises', permission: 'franchises.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales_manager', 'sales', 'reseller'] },
  { module: 'MLM Tree', url: '/mlm', permission: 'mlm.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales_manager', 'sales', 'reseller', 'affiliate'] },

  // Organization
  { module: 'Multi Company', url: '/companies', permission: 'companies.view', roles: ['super_admin', 'erp_admin', 'admin'] },
  { module: 'Multi Branch', url: '/branches', permission: 'branches.view', roles: ['super_admin', 'erp_admin', 'admin', 'inventory_manager', 'inventory'] },
  { module: 'Org Chart', url: '/org-chart', permission: 'org_chart.view', roles: ['super_admin', 'erp_admin', 'admin', 'hr_manager', 'hr'] },

  // Insights
  { module: 'Analytics', url: '/analytics', permission: 'analytics.view', roles: ['super_admin', 'erp_admin', 'admin', 'analytics', 'ai_manager'] },
  { module: 'BI Reports', url: '/reports', permission: 'reports.view', roles: ['super_admin', 'erp_admin', 'admin', 'analytics', 'ai_manager'] },
  { module: 'Heatmaps', url: '/heatmaps', permission: 'heatmaps.view', roles: ['super_admin', 'erp_admin', 'admin', 'analytics', 'ai_manager'] },

  // Platform
  { module: 'Offline Sync', url: '/offline', permission: 'offline.view', roles: ['super_admin', 'erp_admin', 'admin', 'api_manager'] },
  { module: 'Notifications', url: '/notifications', permission: 'notifications.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales', 'crm', 'hr', 'inventory', 'marketplace_vendor', 'reseller', 'affiliate', 'customer', 'billing', 'analytics', 'support', 'security', 'ai_manager', 'api_manager'] },
  { module: 'Messaging', url: '/messaging', permission: 'messaging.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales', 'crm', 'hr', 'inventory', 'support', 'ai_manager'] },
  { module: 'AI Studio', url: '/ai-studio', permission: 'ai_studio.view', roles: ['super_admin', 'erp_admin', 'admin', 'ai_manager'] },
  { module: 'AI Copilot', url: '/copilot', permission: 'copilot.view', roles: ['super_admin', 'erp_admin', 'admin', 'ai_manager', 'sales', 'crm', 'hr', 'inventory', 'support'] },
  { module: 'Automation', url: '/automation', permission: 'automation.view', roles: ['super_admin', 'erp_admin', 'admin', 'api_manager', 'ai_manager'] },
  { module: 'API Manager', url: '/api-manager', permission: 'api_manager.view', roles: ['super_admin', 'erp_admin', 'admin', 'api_manager'] },
  { module: 'Documents', url: '/documents', permission: 'documents.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales', 'crm', 'hr', 'inventory', 'marketplace_vendor', 'reseller', 'affiliate', 'customer', 'billing', 'analytics', 'support', 'security', 'ai_manager', 'api_manager'] },
  { module: 'Approvals', url: '/approvals', permission: 'approvals.view', roles: ['super_admin', 'erp_admin', 'admin', 'hr_manager', 'hr', 'sales_manager', 'sales', 'inventory_manager', 'inventory', 'billing'] },
  { module: 'Website Builder', url: '/website', permission: 'website.view', roles: ['super_admin', 'erp_admin', 'admin', 'ai_manager'] },
  { module: 'Support', url: '/support', permission: 'support.view', roles: ['super_admin', 'erp_admin', 'admin', 'support', 'sales', 'crm', 'hr', 'inventory', 'marketplace_vendor', 'reseller', 'affiliate', 'customer'] },
  { module: 'Knowledge Base', url: '/knowledge', permission: 'knowledge.view', roles: ['super_admin', 'erp_admin', 'admin', 'support', 'sales', 'crm', 'hr', 'inventory', 'marketplace_vendor', 'reseller', 'affiliate', 'customer'] },

  // Security
  { module: 'Audit Logs', url: '/audit', permission: 'audit.view', roles: ['super_admin', 'erp_admin', 'admin', 'security'] },
  { module: 'Sessions', url: '/sessions', permission: 'sessions.view', roles: ['super_admin', 'erp_admin', 'admin', 'security'] },
  { module: 'Devices', url: '/devices', permission: 'devices.view', roles: ['super_admin', 'erp_admin', 'admin', 'security'] },
  { module: 'Threats', url: '/threats', permission: 'threats.view', roles: ['super_admin', 'erp_admin', 'admin', 'security'] },
  { module: 'Audit Trail', url: '/trail', permission: 'trail.view', roles: ['super_admin', 'erp_admin', 'admin', 'security'] },

  // System
  { module: 'Profile', url: '/profile', permission: 'profile.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales', 'crm', 'hr', 'inventory', 'marketplace_vendor', 'reseller', 'affiliate', 'customer', 'billing', 'analytics', 'support', 'security', 'ai_manager', 'api_manager'] },
  { module: 'Wallet', url: '/wallet', permission: 'wallet.view', roles: ['super_admin', 'erp_admin', 'admin', 'billing', 'marketplace_vendor', 'reseller', 'affiliate', 'customer'] },
  { module: 'Leaderboard', url: '/leaderboard', permission: 'leaderboard.view', roles: ['super_admin', 'erp_admin', 'admin', 'sales_manager', 'sales', 'crm_manager', 'crm', 'hr_manager', 'hr', 'inventory_manager', 'inventory', 'marketplace_vendor', 'reseller', 'affiliate'] },
  { module: 'Theme', url: '/theme', permission: 'theme.view', roles: ['super_admin', 'erp_admin', 'admin', 'ai_manager'] },
  { module: 'Roles', url: '/roles', permission: 'roles.view', roles: ['super_admin', 'erp_admin', 'admin', 'security'] },
  { module: 'Settings', url: '/settings', permission: 'settings.view', roles: ['super_admin', 'erp_admin', 'admin'] },

  // Universal Governance Council
  { module: 'System Root', url: '/system-root', permission: 'system_root.view', roles: ['root_admin', 'super_admin'] },
  { module: 'Platform Superuser', url: '/platform-superuser', permission: 'platform_superuser.view', roles: ['global_owner', 'super_admin'] },

  // Global Strategy Division
  { module: 'Strategy Manager', url: '/strategy-manager', permission: 'strategy_manager.view', roles: ['strategy_manager', 'ceo', 'coo', 'super_admin'] },
  { module: 'Transformation Manager', url: '/transformation-manager', permission: 'transformation_manager.view', roles: ['transformation_manager', 'ceo', 'coo', 'super_admin'] },
  { module: 'Business Development Manager', url: '/business-development-manager', permission: 'business_development_manager.view', roles: ['business_development_manager', 'ceo', 'cmo', 'super_admin'] },
  { module: 'Innovation Manager', url: '/innovation-manager', permission: 'innovation_manager.view', roles: ['innovation_manager', 'ceo', 'cto', 'super_admin'] },
  { module: 'R&D Director', url: '/rd-director', permission: 'rd_director.view', roles: ['rd_director', 'cto', 'ceo', 'super_admin'] },

  // Root Operations Division
  { module: 'Operations Commander', url: '/operations-commander', permission: 'operations_commander.view', roles: ['operations_commander', 'coo', 'super_admin'] },
  { module: 'Global Operations Manager', url: '/global-operations-manager', permission: 'global_operations_manager.view', roles: ['global_operations_manager', 'coo', 'super_admin'] },
  { module: 'Regional Director', url: '/regional-director', permission: 'regional_director.view', roles: ['regional_director', 'coo', 'super_admin'] },
  { module: 'Area Manager', url: '/area-manager', permission: 'area_manager.view', roles: ['area_manager', 'coo', 'super_admin'] },

  // AI + Autonomous Systems Division
  { module: 'Agentic AI Manager', url: '/agentic-ai-manager', permission: 'agentic_ai_manager.view', roles: ['agentic_ai_manager', 'ai_manager', 'cto', 'super_admin'] },
  { module: 'Multi Agent Supervisor', url: '/multi-agent-supervisor', permission: 'multi_agent_supervisor.view', roles: ['multi_agent_supervisor', 'ai_manager', 'cto', 'super_admin'] },
  { module: 'AI Validator', url: '/ai-validator', permission: 'ai_validator.view', roles: ['ai_validator', 'ai_manager', 'cto', 'super_admin'] },
  { module: 'Autonomous Systems Manager', url: '/autonomous-systems-manager', permission: 'autonomous_systems_manager.view', roles: ['autonomous_systems_manager', 'ai_manager', 'cto', 'super_admin'] },

  // Infrastructure + Cloud Division
  { module: 'CDN Operations', url: '/cdn-operations', permission: 'cdn_operations.view', roles: ['cdn_operations', 'cloud_admin', 'cto', 'super_admin'] },
  { module: 'High Availability Engineer', url: '/high-availability-engineer', permission: 'high_availability_engineer.view', roles: ['high_availability_engineer', 'cloud_admin', 'cto', 'super_admin'] },

  // Security + Cyber Defense Division
  { module: 'Threat Hunter', url: '/threat-hunter', permission: 'threat_hunter.view', roles: ['threat_hunter', 'soc_manager', 'ciso', 'super_admin'] },
  { module: 'Digital Forensics Analyst', url: '/digital-forensics-analyst', permission: 'digital_forensics_analyst.view', roles: ['digital_forensics_analyst', 'soc_manager', 'ciso', 'super_admin'] },
  { module: 'Cyber Warfare Analyst', url: '/cyber-warfare-analyst', permission: 'cyber_warfare_analyst.view', roles: ['cyber_warfare_analyst', 'soc_manager', 'ciso', 'super_admin'] },

  // HR + Workforce Division
  { module: 'Workforce Planner', url: '/workforce-planner', permission: 'workforce_planner.view', roles: ['workforce_planner', 'hr_manager', 'chro', 'super_admin'] },

  // CRM + Sales Division
  { module: 'Telesales Executive', url: '/telesales-executive', permission: 'telesales_executive.view', roles: ['telesales_executive', 'sales_manager', 'cmo', 'super_admin'] },
  { module: 'Customer Success Manager', url: '/customer-success-manager', permission: 'customer_success_manager.view', roles: ['customer_success_manager', 'crm_manager', 'cmo', 'super_admin'] },
  { module: 'Relationship Manager', url: '/relationship-manager', permission: 'relationship_manager.view', roles: ['relationship_manager', 'sales_manager', 'cmo', 'super_admin'] },

  // Support + Experience Division
  { module: 'Customer Experience Manager', url: '/customer-experience-manager', permission: 'customer_experience_manager.view', roles: ['customer_experience_manager', 'support_manager', 'cmo', 'super_admin'] },
  { module: 'Community Manager', url: '/community-manager', permission: 'community_manager.view', roles: ['community_manager', 'support_manager', 'cmo', 'super_admin'] },

  // Marketplace + Commerce Division
  { module: 'Warehouse Manager', url: '/warehouse-manager', permission: 'warehouse_manager.view', roles: ['warehouse_manager', 'procurement_manager', 'coo', 'super_admin'] },

  // Disaster Recovery + Resilience Division
  { module: 'Recovery Specialist', url: '/recovery-specialist', permission: 'recovery_specialist.view', roles: ['recovery_specialist', 'disaster_recovery_commander', 'cto', 'super_admin'] },
  { module: 'Critical Infrastructure Admin', url: '/critical-infrastructure-admin', permission: 'critical_infrastructure_admin.view', roles: ['critical_infrastructure_admin', 'disaster_recovery_commander', 'cto', 'super_admin'] },

  // Tenant + Multi Branch Division
  { module: 'Tenant Owner', url: '/tenant-owner', permission: 'tenant_owner.view', roles: ['tenant_owner', 'country_admin', 'super_admin'] },
  { module: 'Zone Manager', url: '/zone-manager', permission: 'zone_manager.view', roles: ['zone_manager', 'state_admin', 'super_admin'] },
  { module: 'Hub Manager', url: '/hub-manager', permission: 'hub_manager.view', roles: ['hub_manager', 'city_admin', 'super_admin'] },

  // End User Layer
  { module: 'Operator', url: '/operator', permission: 'operator.view', roles: ['operator', 'employee', 'staff', 'super_admin'] },
  { module: 'Guest User', url: '/guest-user', permission: 'guest_user.view', roles: ['guest_user', 'super_admin'] },
  { module: 'Trial User', url: '/trial-user', permission: 'trial_user.view', roles: ['trial_user', 'customer', 'super_admin'] },

  // Legal + Judicial Division
  { module: 'Legal Manager', url: '/legal-manager', permission: 'legal_manager.view', roles: ['legal_manager', 'corporate_counsel', 'ceo', 'super_admin'] },
  { module: 'Corporate Law Advisor', url: '/corporate-law-advisor', permission: 'corporate_law_advisor.view', roles: ['corporate_law_advisor', 'legal_manager', 'ceo', 'super_admin'] },
  { module: 'Contract Manager', url: '/contract-manager', permission: 'contract_manager.view', roles: ['contract_manager', 'legal_manager', 'ceo', 'super_admin'] },
  { module: 'Case Manager', url: '/case-manager', permission: 'case_manager.view', roles: ['case_manager', 'legal_manager', 'ceo', 'super_admin'] },
  { module: 'Court Admin', url: '/court-admin', permission: 'court_admin.view', roles: ['court_admin', 'legal_manager', 'ceo', 'super_admin'] },
  { module: 'Judicial Coordinator', url: '/judicial-coordinator', permission: 'judicial_coordinator.view', roles: ['judicial_coordinator', 'legal_manager', 'ceo', 'super_admin'] },
  { module: 'Investigation Officer', url: '/investigation-officer', permission: 'investigation_officer.view', roles: ['investigation_officer', 'legal_manager', 'ceo', 'super_admin'] },
  { module: 'Compliance Investigator', url: '/compliance-investigator', permission: 'compliance_investigator.view', roles: ['compliance_investigator', 'legal_manager', 'ciso', 'super_admin'] },
  { module: 'Notary Admin', url: '/notary-admin', permission: 'notary_admin.view', roles: ['notary_admin', 'legal_manager', 'ceo', 'super_admin'] },

  // Public Sector + Government Division
  { module: 'Government Admin', url: '/government-admin', permission: 'government_admin.view', roles: ['government_admin', 'public_sector_admin', 'ceo', 'super_admin'] },
  { module: 'Municipal Admin', url: '/municipal-admin', permission: 'municipal_admin.view', roles: ['municipal_admin', 'government_admin', 'ceo', 'super_admin'] },
  { module: 'Citizen Service Manager', url: '/citizen-service-manager', permission: 'citizen_service_manager.view', roles: ['citizen_service_manager', 'government_admin', 'ceo', 'super_admin'] },
  { module: 'Public Health Admin', url: '/public-health-admin', permission: 'public_health_admin.view', roles: ['public_health_admin', 'government_admin', 'ceo', 'super_admin'] },
  { module: 'Election Commission Admin', url: '/election-commission-admin', permission: 'election_commission_admin.view', roles: ['election_commission_admin', 'government_admin', 'ceo', 'super_admin'] },
  { module: 'Smart City Admin', url: '/smart-city-admin', permission: 'smart_city_admin.view', roles: ['smart_city_admin', 'government_admin', 'cto', 'super_admin'] },
  { module: 'Urban Planning Manager', url: '/urban-planning-manager', permission: 'urban_planning_manager.view', roles: ['urban_planning_manager', 'government_admin', 'ceo', 'super_admin'] },
  { module: 'Rural Development Officer', url: '/rural-development-officer', permission: 'rural_development_officer.view', roles: ['rural_development_officer', 'government_admin', 'ceo', 'super_admin'] },
  { module: 'Land Record Officer', url: '/land-record-officer', permission: 'land_record_officer.view', roles: ['land_record_officer', 'government_admin', 'ceo', 'super_admin'] },

  // Defense + Tactical Operations Division
  { module: 'Defense Command Admin', url: '/defense-command-admin', permission: 'defense_command_admin.view', roles: ['defense_command_admin', 'defense_commander', 'ceo', 'super_admin'] },
  { module: 'Mission Commander', url: '/mission-commander', permission: 'mission_commander.view', roles: ['mission_commander', 'defense_command_admin', 'ceo', 'super_admin'] },
  { module: 'Tactical Operations Officer', url: '/tactical-operations-officer', permission: 'tactical_operations_officer.view', roles: ['tactical_operations_officer', 'defense_command_admin', 'ceo', 'super_admin'] },
  { module: 'Intelligence Analyst', url: '/intelligence-analyst', permission: 'intelligence_analyst.view', roles: ['intelligence_analyst', 'defense_command_admin', 'ciso', 'super_admin'] },
  { module: 'Surveillance Analyst', url: '/surveillance-analyst', permission: 'surveillance_analyst.view', roles: ['surveillance_analyst', 'defense_command_admin', 'ciso', 'super_admin'] },
  { module: 'Border Security Admin', url: '/border-security-admin', permission: 'border_security_admin.view', roles: ['border_security_admin', 'defense_command_admin', 'ceo', 'super_admin'] },
  { module: 'Air Defense Operations', url: '/air-defense-operations', permission: 'air_defense_operations.view', roles: ['air_defense_operations', 'defense_command_admin', 'ceo', 'super_admin'] },
  { module: 'Naval Operations Command', url: '/naval-operations-command', permission: 'naval_operations_command.view', roles: ['naval_operations_command', 'defense_command_admin', 'ceo', 'super_admin'] },
  { module: 'Ground Operations Control', url: '/ground-operations-control', permission: 'ground_operations_control.view', roles: ['ground_operations_control', 'defense_command_admin', 'ceo', 'super_admin'] },
  { module: 'Space Defense Operations', url: '/space-defense-operations', permission: 'space_defense_operations.view', roles: ['space_defense_operations', 'defense_command_admin', 'cto', 'super_admin'] },

  // Healthcare + Medical Division
  { module: 'Healthcare Manager', url: '/healthcare-manager', permission: 'healthcare_manager.view', roles: ['healthcare_manager', 'medical_director', 'ceo', 'super_admin'] },
  { module: 'Medical Director', url: '/medical-director', permission: 'medical_director.view', roles: ['medical_director', 'healthcare_manager', 'ceo', 'super_admin'] },
  { module: 'Hospital Admin', url: '/hospital-admin', permission: 'hospital_admin.view', roles: ['hospital_admin', 'healthcare_manager', 'ceo', 'super_admin'] },
  { module: 'Clinical Operations Manager', url: '/clinical-operations-manager', permission: 'clinical_operations_manager.view', roles: ['clinical_operations_manager', 'medical_director', 'ceo', 'super_admin'] },
  { module: 'Pharmacy Manager', url: '/pharmacy-manager', permission: 'pharmacy_manager.view', roles: ['pharmacy_manager', 'medical_director', 'ceo', 'super_admin'] },
  { module: 'Lab Manager', url: '/lab-manager', permission: 'lab_manager.view', roles: ['lab_manager', 'medical_director', 'ceo', 'super_admin'] },
  { module: 'Radiology Manager', url: '/radiology-manager', permission: 'radiology_manager.view', roles: ['radiology_manager', 'medical_director', 'ceo', 'super_admin'] },
  { module: 'Blood Bank Manager', url: '/blood-bank-manager', permission: 'blood_bank_manager.view', roles: ['blood_bank_manager', 'medical_director', 'ceo', 'super_admin'] },
  { module: 'Organ Donation Coordinator', url: '/organ-donation-coordinator', permission: 'organ_donation_coordinator.view', roles: ['organ_donation_coordinator', 'medical_director', 'ceo', 'super_admin'] },
  { module: 'Public Health Officer', url: '/public-health-officer', permission: 'public_health_officer.view', roles: ['public_health_officer', 'healthcare_manager', 'ceo', 'super_admin'] },

  // Education + Research Division
  { module: 'School Admin', url: '/school-admin', permission: 'school_admin.view', roles: ['school_admin', 'education_director', 'ceo', 'super_admin'] },
  { module: 'College Admin', url: '/college-admin', permission: 'college_admin.view', roles: ['college_admin', 'education_director', 'ceo', 'super_admin'] },
  { module: 'University Admin', url: '/university-admin', permission: 'university_admin.view', roles: ['university_admin', 'education_director', 'ceo', 'super_admin'] },
  { module: 'LMS Manager', url: '/lms-manager', permission: 'lms_manager.view', roles: ['lms_manager', 'education_director', 'cto', 'super_admin'] },
  { module: 'Exam Manager', url: '/exam-manager', permission: 'exam_manager.view', roles: ['exam_manager', 'education_director', 'ceo', 'super_admin'] },
  { module: 'Trainer', url: '/trainer', permission: 'trainer.view', roles: ['trainer', 'education_director', 'ceo', 'super_admin'] },
  { module: 'Research Manager', url: '/research-manager', permission: 'research_manager.view', roles: ['research_manager', 'rd_director', 'cto', 'super_admin'] },
  { module: 'Scientist', url: '/scientist', permission: 'scientist.view', roles: ['scientist', 'research_manager', 'cto', 'super_admin'] },
  { module: 'Data Curator', url: '/data-curator', permission: 'data_curator.view', roles: ['data_curator', 'research_manager', 'cto', 'super_admin'] },
  { module: 'Librarian', url: '/librarian', permission: 'librarian.view', roles: ['librarian', 'education_director', 'ceo', 'super_admin'] },

  // Industrial + Manufacturing Division
  { module: 'Smart Factory Manager', url: '/smart-factory-manager', permission: 'smart_factory_manager.view', roles: ['smart_factory_manager', 'manufacturing_manager', 'coo', 'super_admin'] },
  { module: 'Maintenance Manager', url: '/maintenance-manager', permission: 'maintenance_manager.view', roles: ['maintenance_manager', 'manufacturing_manager', 'coo', 'super_admin'] },
  { module: 'Industrial Safety Officer', url: '/industrial-safety-officer', permission: 'industrial_safety_officer.view', roles: ['industrial_safety_officer', 'manufacturing_manager', 'coo', 'super_admin'] },
  { module: 'Machine Operations Supervisor', url: '/machine-operations-supervisor', permission: 'machine_operations_supervisor.view', roles: ['machine_operations_supervisor', 'manufacturing_manager', 'coo', 'super_admin'] },
  { module: 'IoT Manager', url: '/iot-manager', permission: 'iot_manager.view', roles: ['iot_manager', 'cloud_admin', 'cto', 'super_admin'] },
  { module: 'Robotics Operations Manager', url: '/robotics-operations-manager', permission: 'robotics_operations_manager.view', roles: ['robotics_operations_manager', 'manufacturing_manager', 'cto', 'super_admin'] },
  { module: 'Digital Twin Manager', url: '/digital-twin-manager', permission: 'digital_twin_manager.view', roles: ['digital_twin_manager', 'manufacturing_manager', 'cto', 'super_admin'] },

  // Transport + Aviation + Marine Division
  { module: 'Transport Manager', url: '/transport-manager', permission: 'transport_manager.view', roles: ['transport_manager', 'logistics_director', 'coo', 'super_admin'] },
  { module: 'Aviation Manager', url: '/aviation-manager', permission: 'aviation_manager.view', roles: ['aviation_manager', 'transport_manager', 'coo', 'super_admin'] },
  { module: 'Air Traffic Manager', url: '/air-traffic-manager', permission: 'air_traffic_manager.view', roles: ['air_traffic_manager', 'aviation_manager', 'coo', 'super_admin'] },
  { module: 'Railway Operations Manager', url: '/railway-operations-manager', permission: 'railway_operations_manager.view', roles: ['railway_operations_manager', 'transport_manager', 'coo', 'super_admin'] },
  { module: 'Port Authority Manager', url: '/port-authority-manager', permission: 'port_authority_manager.view', roles: ['port_authority_manager', 'transport_manager', 'coo', 'super_admin'] },
  { module: 'Marine Manager', url: '/marine-manager', permission: 'marine_manager.view', roles: ['marine_manager', 'transport_manager', 'coo', 'super_admin'] },
  { module: 'Drone Operations Manager', url: '/drone-operations-manager', permission: 'drone_operations_manager.view', roles: ['drone_operations_manager', 'aviation_manager', 'cto', 'super_admin'] },
  { module: 'Fleet Manager', url: '/fleet-manager', permission: 'fleet_manager.view', roles: ['fleet_manager', 'transport_manager', 'coo', 'super_admin'] },
  { module: 'Smart Transport Admin', url: '/smart-transport-admin', permission: 'smart_transport_admin.view', roles: ['smart_transport_admin', 'transport_manager', 'cto', 'super_admin'] },

  // Energy + Utilities Division
  { module: 'Energy Manager', url: '/energy-manager', permission: 'energy_manager.view', roles: ['energy_manager', 'utilities_director', 'coo', 'super_admin'] },
  { module: 'Smart Grid Manager', url: '/smart-grid-manager', permission: 'smart_grid_manager.view', roles: ['smart_grid_manager', 'energy_manager', 'cto', 'super_admin'] },
  { module: 'Water Resource Manager', url: '/water-resource-manager', permission: 'water_resource_manager.view', roles: ['water_resource_manager', 'utilities_director', 'coo', 'super_admin'] },
  { module: 'Power Plant Operator', url: '/power-plant-operator', permission: 'power_plant_operator.view', roles: ['power_plant_operator', 'energy_manager', 'coo', 'super_admin'] },
  { module: 'Utilities Manager', url: '/utilities-manager', permission: 'utilities_manager.view', roles: ['utilities_manager', 'energy_manager', 'coo', 'super_admin'] },
  { module: 'Environmental Manager', url: '/environmental-manager', permission: 'environmental_manager.view', roles: ['environmental_manager', 'utilities_director', 'ceo', 'super_admin'] },
  { module: 'Carbon Accounting Manager', url: '/carbon-accounting-manager', permission: 'carbon_accounting_manager.view', roles: ['carbon_accounting_manager', 'environmental_manager', 'ceo', 'super_admin'] },
  { module: 'Waste Management Officer', url: '/waste-management-officer', permission: 'waste_management_officer.view', roles: ['waste_management_officer', 'utilities_director', 'coo', 'super_admin'] },

  // Media + Broadcast Division
  { module: 'Media Broadcast Manager', url: '/media-broadcast-manager', permission: 'media_broadcast_manager.view', roles: ['media_broadcast_manager', 'content_director', 'cmo', 'super_admin'] },
  { module: 'Newsroom Manager', url: '/newsroom-manager', permission: 'newsroom_manager.view', roles: ['newsroom_manager', 'media_broadcast_manager', 'cmo', 'super_admin'] },
  { module: 'Journalist', url: '/journalist', permission: 'journalist.view', roles: ['journalist', 'newsroom_manager', 'cmo', 'super_admin'] },
  { module: 'Investigative Reporter', url: '/investigative-reporter', permission: 'investigative_reporter.view', roles: ['investigative_reporter', 'newsroom_manager', 'cmo', 'super_admin'] },
  { module: 'Broadcast Engineer', url: '/broadcast-engineer', permission: 'broadcast_engineer.view', roles: ['broadcast_engineer', 'media_broadcast_manager', 'cto', 'super_admin'] },
  { module: 'Streaming Manager', url: '/streaming-manager', permission: 'streaming_manager.view', roles: ['streaming_manager', 'media_broadcast_manager', 'cto', 'super_admin'] },
  { module: 'Audio Engineer', url: '/audio-engineer', permission: 'audio_engineer.view', roles: ['audio_engineer', 'media_broadcast_manager', 'cto', 'super_admin'] },
  { module: 'Publishing Manager', url: '/publishing-manager', permission: 'publishing_manager.view', roles: ['publishing_manager', 'media_broadcast_manager', 'cmo', 'super_admin'] },

  // Web3 + Blockchain Division
  { module: 'Blockchain Manager', url: '/blockchain-manager', permission: 'blockchain_manager.view', roles: ['blockchain_manager', 'web3_director', 'cto', 'super_admin'] },
  { module: 'Web3 Admin', url: '/web3-admin', permission: 'web3_admin.view', roles: ['web3_admin', 'blockchain_manager', 'cto', 'super_admin'] },
  { module: 'DAO Governor', url: '/dao-governor', permission: 'dao_governor.view', roles: ['dao_governor', 'blockchain_manager', 'ceo', 'super_admin'] },
  { module: 'NFT Manager', url: '/nft-manager', permission: 'nft_manager.view', roles: ['nft_manager', 'blockchain_manager', 'cto', 'super_admin'] },
  { module: 'Crypto Admin', url: '/crypto-admin', permission: 'crypto_admin.view', roles: ['crypto_admin', 'blockchain_manager', 'cto', 'super_admin'] },
  { module: 'Smart Contract Auditor', url: '/smart-contract-auditor', permission: 'smart_contract_auditor.view', roles: ['smart_contract_auditor', 'blockchain_manager', 'ciso', 'super_admin'] },
  { module: 'Token Governance Officer', url: '/token-governance-officer', permission: 'token_governance_officer.view', roles: ['token_governance_officer', 'blockchain_manager', 'ceo', 'super_admin'] },
  { module: 'Wallet Security Admin', url: '/wallet-security-admin', permission: 'wallet_security_admin.view', roles: ['wallet_security_admin', 'blockchain_manager', 'ciso', 'super_admin'] },

  // Space + Advanced Research Division
  { module: 'Space Operations Manager', url: '/space-operations-manager', permission: 'space_operations_manager.view', roles: ['space_operations_manager', 'space_commander', 'cto', 'super_admin'] },
  { module: 'Satellite Control Manager', url: '/satellite-control-manager', permission: 'satellite_control_manager.view', roles: ['satellite_control_manager', 'space_operations_manager', 'cto', 'super_admin'] },
  { module: 'Mission Specialist', url: '/mission-specialist', permission: 'mission_specialist.view', roles: ['mission_specialist', 'space_operations_manager', 'cto', 'super_admin'] },
  { module: 'Ground Control Engineer', url: '/ground-control-engineer', permission: 'ground_control_engineer.view', roles: ['ground_control_engineer', 'space_operations_manager', 'cto', 'super_admin'] },
  { module: 'Launch Director', url: '/launch-director', permission: 'launch_director.view', roles: ['launch_director', 'space_operations_manager', 'cto', 'super_admin'] },
  { module: 'Payload Specialist', url: '/payload-specialist', permission: 'payload_specialist.view', roles: ['payload_specialist', 'space_operations_manager', 'cto', 'super_admin'] },
  { module: 'Quantum System Admin', url: '/quantum-system-admin', permission: 'quantum_system_admin.view', roles: ['quantum_system_admin', 'research_director', 'cto', 'super_admin'] },
  { module: 'Quantum Researcher', url: '/quantum-researcher', permission: 'quantum_researcher.view', roles: ['quantum_researcher', 'quantum_system_admin', 'cto', 'super_admin'] },
  { module: 'Deep Space Network Admin', url: '/deep-space-network-admin', permission: 'deep_space_network_admin.view', roles: ['deep_space_network_admin', 'space_operations_manager', 'cto', 'super_admin'] },

  // Agriculture + Food Division
  { module: 'Agriculture Manager', url: '/agriculture-manager', permission: 'agriculture_manager.view', roles: ['agriculture_manager', 'agriculture_director', 'ceo', 'super_admin'] },
  { module: 'Farm Operations Manager', url: '/farm-operations-manager', permission: 'farm_operations_manager.view', roles: ['farm_operations_manager', 'agriculture_manager', 'ceo', 'super_admin'] },
  { module: 'Irrigation Supervisor', url: '/irrigation-supervisor', permission: 'irrigation_supervisor.view', roles: ['irrigation_supervisor', 'agriculture_manager', 'ceo', 'super_admin'] },
  { module: 'Crop Analyst', url: '/crop-analyst', permission: 'crop_analyst.view', roles: ['crop_analyst', 'agriculture_manager', 'ceo', 'super_admin'] },
  { module: 'Food Safety Officer', url: '/food-safety-officer', permission: 'food_safety_officer.view', roles: ['food_safety_officer', 'agriculture_manager', 'ceo', 'super_admin'] },
  { module: 'Fishery Manager', url: '/fishery-manager', permission: 'fishery_manager.view', roles: ['fishery_manager', 'agriculture_manager', 'ceo', 'super_admin'] },
  { module: 'Forestry Manager', url: '/forestry-manager', permission: 'forestry_manager.view', roles: ['forestry_manager', 'agriculture_manager', 'ceo', 'super_admin'] },
  { module: 'Wildlife Protection Officer', url: '/wildlife-protection-officer', permission: 'wildlife_protection_officer.view', roles: ['wildlife_protection_officer', 'agriculture_manager', 'ceo', 'super_admin'] },
  { module: 'Zoo Operations Manager', url: '/zoo-operations-manager', permission: 'zoo_operations_manager.view', roles: ['zoo_operations_manager', 'agriculture_manager', 'ceo', 'super_admin'] },

  // Real Estate + Infrastructure Division
  { module: 'Real Estate Manager', url: '/real-estate-manager', permission: 'real_estate_manager.view', roles: ['real_estate_manager', 'infrastructure_director', 'ceo', 'super_admin'] },
  { module: 'Property Registrar', url: '/property-registrar', permission: 'property_registrar.view', roles: ['property_registrar', 'real_estate_manager', 'ceo', 'super_admin'] },
  { module: 'Facility Manager', url: '/facility-manager', permission: 'facility_manager.view', roles: ['facility_manager', 'real_estate_manager', 'ceo', 'super_admin'] },
  { module: 'Construction Manager', url: '/construction-manager', permission: 'construction_manager.view', roles: ['construction_manager', 'real_estate_manager', 'ceo', 'super_admin'] },
  { module: 'Site Engineer', url: '/site-engineer', permission: 'site_engineer.view', roles: ['site_engineer', 'construction_manager', 'ceo', 'super_admin'] },
  { module: 'Civil Engineer', url: '/civil-engineer', permission: 'civil_engineer.view', roles: ['civil_engineer', 'construction_manager', 'ceo', 'super_admin'] },
  { module: 'Electrical Engineer', url: '/electrical-engineer', permission: 'electrical_engineer.view', roles: ['electrical_engineer', 'construction_manager', 'ceo', 'super_admin'] },
  { module: 'Mechanical Engineer', url: '/mechanical-engineer', permission: 'mechanical_engineer.view', roles: ['mechanical_engineer', 'construction_manager', 'ceo', 'super_admin'] },
  { module: 'Architectural Coordinator', url: '/architectural-coordinator', permission: 'architectural_coordinator.view', roles: ['architectural_coordinator', 'construction_manager', 'ceo', 'super_admin'] },

  // Hospitality + Tourism Division
  { module: 'Hotel Manager', url: '/hotel-manager', permission: 'hotel_manager.view', roles: ['hotel_manager', 'hospitality_director', 'ceo', 'super_admin'] },
  { module: 'Restaurant Manager', url: '/restaurant-manager', permission: 'restaurant_manager.view', roles: ['restaurant_manager', 'hospitality_director', 'ceo', 'super_admin'] },
  { module: 'Tourism Manager', url: '/tourism-manager', permission: 'tourism_manager.view', roles: ['tourism_manager', 'hospitality_director', 'ceo', 'super_admin'] },
  { module: 'Travel Operations Manager', url: '/travel-operations-manager', permission: 'travel_operations_manager.view', roles: ['travel_operations_manager', 'tourism_manager', 'ceo', 'super_admin'] },
  { module: 'Booking Manager', url: '/booking-manager', permission: 'booking_manager.view', roles: ['booking_manager', 'tourism_manager', 'ceo', 'super_admin'] },
  { module: 'Event Manager', url: '/event-manager', permission: 'event_manager.view', roles: ['event_manager', 'hospitality_director', 'ceo', 'super_admin'] },
  { module: 'Front Office Manager', url: '/front-office-manager', permission: 'front_office_manager.view', roles: ['front_office_manager', 'hotel_manager', 'ceo', 'super_admin'] },
  { module: 'Housekeeping Supervisor', url: '/housekeeping-supervisor', permission: 'housekeeping_supervisor.view', roles: ['housekeeping_supervisor', 'hotel_manager', 'ceo', 'super_admin'] },
  { module: 'Customer Hospitality Lead', url: '/customer-hospitality-lead', permission: 'customer_hospitality_lead.view', roles: ['customer_hospitality_lead', 'hospitality_director', 'ceo', 'super_admin'] },

  // Sports + Fitness Division
  { module: 'Sports Manager', url: '/sports-manager', permission: 'sports_manager.view', roles: ['sports_manager', 'fitness_director', 'ceo', 'super_admin'] },
  { module: 'Athlete Manager', url: '/athlete-manager', permission: 'athlete_manager.view', roles: ['athlete_manager', 'sports_manager', 'ceo', 'super_admin'] },
  { module: 'Tournament Manager', url: '/tournament-manager', permission: 'tournament_manager.view', roles: ['tournament_manager', 'sports_manager', 'ceo', 'super_admin'] },
  { module: 'Referee Panel', url: '/referee-panel', permission: 'referee_panel.view', roles: ['referee_panel', 'sports_manager', 'ceo', 'super_admin'] },
  { module: 'Gym Manager', url: '/gym-manager', permission: 'gym_manager.view', roles: ['gym_manager', 'fitness_director', 'ceo', 'super_admin'] },
  { module: 'Fitness Trainer', url: '/fitness-trainer', permission: 'fitness_trainer.view', roles: ['fitness_trainer', 'gym_manager', 'ceo', 'super_admin'] },
  { module: 'Wellness Coach', url: '/wellness-coach', permission: 'wellness_coach.view', roles: ['wellness_coach', 'fitness_director', 'ceo', 'super_admin'] },
  { module: 'Esports Manager', url: '/esports-manager', permission: 'esports_manager.view', roles: ['esports_manager', 'sports_manager', 'ceo', 'super_admin'] },
  { module: 'Gaming Admin', url: '/gaming-admin', permission: 'gaming_admin.view', roles: ['gaming_admin', 'esports_manager', 'cto', 'super_admin'] },

  // NGO + Social Welfare Division
  { module: 'NGO Manager', url: '/ngo-manager', permission: 'ngo_manager.view', roles: ['ngo_manager', 'social_welfare_director', 'ceo', 'super_admin'] },
  { module: 'Donor Manager', url: '/donor-manager', permission: 'donor_manager.view', roles: ['donor_manager', 'ngo_manager', 'ceo', 'super_admin'] },
  { module: 'Volunteer Manager', url: '/volunteer-manager', permission: 'volunteer_manager.view', roles: ['volunteer_manager', 'ngo_manager', 'ceo', 'super_admin'] },
  { module: 'Beneficiary Manager', url: '/beneficiary-manager', permission: 'beneficiary_manager.view', roles: ['beneficiary_manager', 'ngo_manager', 'ceo', 'super_admin'] },
  { module: 'Social Work Manager', url: '/social-work-manager', permission: 'social_work_manager.view', roles: ['social_work_manager', 'ngo_manager', 'ceo', 'super_admin'] },
  { module: 'Child Welfare Officer', url: '/child-welfare-officer', permission: 'child_welfare_officer.view', roles: ['child_welfare_officer', 'ngo_manager', 'ceo', 'super_admin'] },
  { module: 'Relief Operations Manager', url: '/relief-operations-manager', permission: 'relief_operations_manager.view', roles: ['relief_operations_manager', 'ngo_manager', 'ceo', 'super_admin'] },
  { module: 'Humanitarian Operations Manager', url: '/humanitarian-operations-manager', permission: 'humanitarian_operations_manager.view', roles: ['humanitarian_operations_manager', 'ngo_manager', 'ceo', 'super_admin'] },
  { module: 'Community Outreach Lead', url: '/community-outreach-lead', permission: 'community_outreach_lead.view', roles: ['community_outreach_lead', 'ngo_manager', 'ceo', 'super_admin'] },

  // Banking + Insurance Division
  { module: 'Banking Manager', url: '/banking-manager', permission: 'banking_manager.view', roles: ['banking_manager', 'finance_director', 'ceo', 'super_admin'] },
  { module: 'Loan Officer', url: '/loan-officer', permission: 'loan_officer.view', roles: ['loan_officer', 'banking_manager', 'ceo', 'super_admin'] },
  { module: 'Underwriter', url: '/underwriter', permission: 'underwriter.view', roles: ['underwriter', 'banking_manager', 'ceo', 'super_admin'] },
  { module: 'Claims Manager', url: '/claims-manager', permission: 'claims_manager.view', roles: ['claims_manager', 'insurance_director', 'ceo', 'super_admin'] },
  { module: 'Risk Underwriter', url: '/risk-underwriter', permission: 'risk_underwriter.view', roles: ['risk_underwriter', 'insurance_director', 'ceo', 'super_admin'] },
  { module: 'Credit Analyst', url: '/credit-analyst', permission: 'credit_analyst.view', roles: ['credit_analyst', 'banking_manager', 'ceo', 'super_admin'] },
  { module: 'Investment Manager', url: '/investment-manager', permission: 'investment_manager.view', roles: ['investment_manager', 'finance_director', 'ceo', 'super_admin'] },
  { module: 'Wealth Manager', url: '/wealth-manager', permission: 'wealth_manager.view', roles: ['wealth_manager', 'finance_director', 'ceo', 'super_admin'] },
  { module: 'Treasury Analyst', url: '/treasury-analyst', permission: 'treasury_analyst.view', roles: ['treasury_analyst', 'finance_director', 'ceo', 'super_admin'] },

  // Telecom + Network Operations Division
  { module: 'Telecom Manager', url: '/telecom-manager', permission: 'telecom_manager.view', roles: ['telecom_manager', 'network_director', 'cto', 'super_admin'] },
  { module: 'Network Operations Center', url: '/network-operations-center', permission: 'network_operations_center.view', roles: ['network_operations_center', 'telecom_manager', 'cto', 'super_admin'] },
  { module: 'Signal Engineer', url: '/signal-engineer', permission: 'signal_engineer.view', roles: ['signal_engineer', 'telecom_manager', 'cto', 'super_admin'] },
  { module: 'Tower Operations Manager', url: '/tower-operations-manager', permission: 'tower_operations_manager.view', roles: ['tower_operations_manager', 'telecom_manager', 'ceo', 'super_admin'] },
  { module: 'Communications Supervisor', url: '/communications-supervisor', permission: 'communications_supervisor.view', roles: ['communications_supervisor', 'telecom_manager', 'ceo', 'super_admin'] },
  { module: 'SatCom Operations', url: '/satcom-operations', permission: 'satcom_operations.view', roles: ['satcom_operations', 'telecom_manager', 'cto', 'super_admin'] },
  { module: 'RF Engineer', url: '/rf-engineer', permission: 'rf_engineer.view', roles: ['rf_engineer', 'telecom_manager', 'cto', 'super_admin'] },
  { module: 'Bandwidth Analyst', url: '/bandwidth-analyst', permission: 'bandwidth_analyst.view', roles: ['bandwidth_analyst', 'telecom_manager', 'cto', 'super_admin'] },
  { module: 'Connectivity Manager', url: '/connectivity-manager', permission: 'connectivity_manager.view', roles: ['connectivity_manager', 'telecom_manager', 'cto', 'super_admin'] },

  // Customer Field Operations Division
  { module: 'Field Service Manager', url: '/field-service-manager', permission: 'field_service_manager.view', roles: ['field_service_manager', 'operations_director', 'coo', 'super_admin'] },
  { module: 'Installation Engineer', url: '/installation-engineer', permission: 'installation_engineer.view', roles: ['installation_engineer', 'field_service_manager', 'coo', 'super_admin'] },
  { module: 'Service Engineer', url: '/service-engineer', permission: 'service_engineer.view', roles: ['service_engineer', 'field_service_manager', 'coo', 'super_admin'] },
  { module: 'Field Technician', url: '/field-technician', permission: 'field_technician.view', roles: ['field_technician', 'field_service_manager', 'coo', 'super_admin'] },
  { module: 'Dispatcher', url: '/dispatcher', permission: 'dispatcher.view', roles: ['dispatcher', 'field_service_manager', 'coo', 'super_admin'] },
  { module: 'Route Manager', url: '/route-manager', permission: 'route_manager.view', roles: ['route_manager', 'field_service_manager', 'coo', 'super_admin'] },
  { module: 'Delivery Executive', url: '/delivery-executive', permission: 'delivery_executive.view', roles: ['delivery_executive', 'field_service_manager', 'coo', 'super_admin'] },
  { module: 'Onsite Support Engineer', url: '/onsite-support-engineer', permission: 'onsite_support_engineer.view', roles: ['onsite_support_engineer', 'field_service_manager', 'coo', 'super_admin'] },
  { module: 'Customer Visit Coordinator', url: '/customer-visit-coordinator', permission: 'customer_visit_coordinator.view', roles: ['customer_visit_coordinator', 'field_service_manager', 'coo', 'super_admin'] },

  // Advanced AI + ML Operations Division
  { module: 'MLOps Engineer', url: '/mlops-engineer', permission: 'mlops_engineer.view', roles: ['mlops_engineer', 'ml_director', 'cto', 'super_admin'] },
  { module: 'Feature Store Admin', url: '/feature-store-admin', permission: 'feature_store_admin.view', roles: ['feature_store_admin', 'ml_director', 'cto', 'super_admin'] },
  { module: 'Inference Server Admin', url: '/inference-server-admin', permission: 'inference_server_admin.view', roles: ['inference_server_admin', 'ml_director', 'cto', 'super_admin'] },
  { module: 'Synthetic Data Engineer', url: '/synthetic-data-engineer', permission: 'synthetic_data_engineer.view', roles: ['synthetic_data_engineer', 'ml_director', 'cto', 'super_admin'] },
  { module: 'Data Labeling Manager', url: '/data-labeling-manager', permission: 'data_labeling_manager.view', roles: ['data_labeling_manager', 'ml_director', 'ceo', 'super_admin'] },
  { module: 'Annotation Specialist', url: '/annotation-specialist', permission: 'annotation_specialist.view', roles: ['annotation_specialist', 'data_labeling_manager', 'ceo', 'super_admin'] },
  { module: 'Model Observability Engineer', url: '/model-observability-engineer', permission: 'model_observability_engineer.view', roles: ['model_observability_engineer', 'ml_director', 'cto', 'super_admin'] },
  { module: 'AI Incident Responder', url: '/ai-incident-responder', permission: 'ai_incident_responder.view', roles: ['ai_incident_responder', 'ml_director', 'cto', 'super_admin'] },
  { module: 'Autonomous AI Supervisor', url: '/autonomous-ai-supervisor', permission: 'autonomous_ai_supervisor.view', roles: ['autonomous_ai_supervisor', 'ml_director', 'cto', 'super_admin'] },

  // Root Platform Internal Division
  { module: 'Service Orchestrator', url: '/service-orchestrator', permission: 'service_orchestrator.view', roles: ['service_orchestrator', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Pipeline Operator', url: '/pipeline-operator', permission: 'pipeline_operator.view', roles: ['pipeline_operator', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Message Bus Admin', url: '/message-bus-admin', permission: 'message_bus_admin.view', roles: ['message_bus_admin', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Cache Governance Engineer', url: '/cache-governance-engineer', permission: 'cache_governance_engineer.view', roles: ['cache_governance_engineer', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'State Synchronization Engineer', url: '/state-synchronization-engineer', permission: 'state_synchronization_engineer.view', roles: ['state_synchronization_engineer', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Dependency Graph Engineer', url: '/dependency-graph-engineer', permission: 'dependency_graph_engineer.view', roles: ['dependency_graph_engineer', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Runtime Validation Engineer', url: '/runtime-validation-engineer', permission: 'runtime_validation_engineer.view', roles: ['runtime_validation_engineer', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Orchestration Recovery Engineer', url: '/orchestration-recovery-engineer', permission: 'orchestration_recovery_engineer.view', roles: ['orchestration_recovery_engineer', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Universal Telemetry Admin', url: '/universal-telemetry-admin', permission: 'universal_telemetry_admin.view', roles: ['universal_telemetry_admin', 'platform_architect', 'cto', 'super_admin'] },

  // Religious + Cultural Division
  { module: 'Religious Organization Admin', url: '/religious-organization-admin', permission: 'religious_organization_admin.view', roles: ['religious_organization_admin', 'cultural_director', 'ceo', 'super_admin'] },
  { module: 'Spiritual Counselor', url: '/spiritual-counselor', permission: 'spiritual_counselor.view', roles: ['spiritual_counselor', 'religious_organization_admin', 'ceo', 'super_admin'] },
  { module: 'Cultural Heritage Officer', url: '/cultural-heritage-officer', permission: 'cultural_heritage_officer.view', roles: ['cultural_heritage_officer', 'cultural_director', 'ceo', 'super_admin'] },
  { module: 'Museum Curator', url: '/museum-curator', permission: 'museum_curator.view', roles: ['museum_curator', 'cultural_heritage_officer', 'ceo', 'super_admin'] },
  { module: 'Archaeology Manager', url: '/archaeology-manager', permission: 'archaeology_manager.view', roles: ['archaeology_manager', 'cultural_director', 'ceo', 'super_admin'] },
  { module: 'Event Ceremony Coordinator', url: '/event-ceremony-coordinator', permission: 'event_ceremony_coordinator.view', roles: ['event_ceremony_coordinator', 'religious_organization_admin', 'ceo', 'super_admin'] },
  { module: 'Community Spiritual Lead', url: '/community-spiritual-lead', permission: 'community_spiritual_lead.view', roles: ['community_spiritual_lead', 'religious_organization_admin', 'ceo', 'super_admin'] },
  { module: 'Heritage Records Officer', url: '/heritage-records-officer', permission: 'heritage_records_officer.view', roles: ['heritage_records_officer', 'cultural_heritage_officer', 'ceo', 'super_admin'] },

  // Legal Enforcement + Corrections Division
  { module: 'Police Admin', url: '/police-admin', permission: 'police_admin.view', roles: ['police_admin', 'law_enforcement_director', 'ceo', 'super_admin'] },
  { module: 'Cyber Crime Officer', url: '/cyber-crime-officer', permission: 'cyber_crime_officer.view', roles: ['cyber_crime_officer', 'police_admin', 'ciso', 'super_admin'] },
  { module: 'Forensic Analyst', url: '/forensic-analyst', permission: 'forensic_analyst.view', roles: ['forensic_analyst', 'police_admin', 'ceo', 'super_admin'] },
  { module: 'Detective Operations', url: '/detective-operations', permission: 'detective_operations.view', roles: ['detective_operations', 'police_admin', 'ceo', 'super_admin'] },
  { module: 'Prison Admin', url: '/prison-admin', permission: 'prison_admin.view', roles: ['prison_admin', 'corrections_director', 'ceo', 'super_admin'] },
  { module: 'Parole Officer', url: '/parole-officer', permission: 'parole_officer.view', roles: ['parole_officer', 'prison_admin', 'ceo', 'super_admin'] },
  { module: 'Probation Officer', url: '/probation-officer', permission: 'probation_officer.view', roles: ['probation_officer', 'prison_admin', 'ceo', 'super_admin'] },
  { module: 'Criminal Records Officer', url: '/criminal-records-officer', permission: 'criminal_records_officer.view', roles: ['criminal_records_officer', 'police_admin', 'ceo', 'super_admin'] },
  { module: 'Law Enforcement Dispatch', url: '/law-enforcement-dispatch', permission: 'law_enforcement_dispatch.view', roles: ['law_enforcement_dispatch', 'police_admin', 'ceo', 'super_admin'] },

  // Emergency + Rescue Division
  { module: 'Emergency Response Manager', url: '/emergency-response-manager', permission: 'emergency_response_manager.view', roles: ['emergency_response_manager', 'emergency_director', 'ceo', 'super_admin'] },
  { module: 'Fire Safety Officer', url: '/fire-safety-officer', permission: 'fire_safety_officer.view', roles: ['fire_safety_officer', 'emergency_response_manager', 'ceo', 'super_admin'] },
  { module: 'Rescue Operations Manager', url: '/rescue-operations-manager', permission: 'rescue_operations_manager.view', roles: ['rescue_operations_manager', 'emergency_response_manager', 'ceo', 'super_admin'] },
  { module: 'Paramedic Coordinator', url: '/paramedic-coordinator', permission: 'paramedic_coordinator.view', roles: ['paramedic_coordinator', 'emergency_response_manager', 'ceo', 'super_admin'] },
  { module: 'Ambulance Operations Manager', url: '/ambulance-operations-manager', permission: 'ambulance_operations_manager.view', roles: ['ambulance_operations_manager', 'emergency_response_manager', 'ceo', 'super_admin'] },
  { module: 'Disaster Response Officer', url: '/disaster-response-officer', permission: 'disaster_response_officer.view', roles: ['disaster_response_officer', 'emergency_response_manager', 'ceo', 'super_admin'] },
  { module: 'Crisis Response Commander', url: '/crisis-response-commander', permission: 'crisis_response_commander.view', roles: ['crisis_response_commander', 'emergency_director', 'ceo', 'super_admin'] },
  { module: 'Relief Camp Admin', url: '/relief-camp-admin', permission: 'relief_camp_admin.view', roles: ['relief_camp_admin', 'emergency_response_manager', 'ceo', 'super_admin'] },
  { module: 'Emergency Communication Officer', url: '/emergency-communication-officer', permission: 'emergency_communication_officer.view', roles: ['emergency_communication_officer', 'emergency_response_manager', 'ceo', 'super_admin'] },

  // Lab + Scientific Operations Division
  { module: 'Laboratory Director', url: '/laboratory-director', permission: 'laboratory_director.view', roles: ['laboratory_director', 'research_director', 'cto', 'super_admin'] },
  { module: 'Bioinformatics Manager', url: '/bioinformatics-manager', permission: 'bioinformatics_manager.view', roles: ['bioinformatics_manager', 'laboratory_director', 'cto', 'super_admin'] },
  { module: 'Clinical Research Coordinator', url: '/clinical-research-coordinator', permission: 'clinical_research_coordinator.view', roles: ['clinical_research_coordinator', 'laboratory_director', 'ceo', 'super_admin'] },
  { module: 'Genetics Analyst', url: '/genetics-analyst', permission: 'genetics_analyst.view', roles: ['genetics_analyst', 'laboratory_director', 'cto', 'super_admin'] },
  { module: 'Sample Processing Supervisor', url: '/sample-processing-supervisor', permission: 'sample_processing_supervisor.view', roles: ['sample_processing_supervisor', 'laboratory_director', 'ceo', 'super_admin'] },
  { module: 'Research Data Engineer', url: '/research-data-engineer', permission: 'research_data_engineer.view', roles: ['research_data_engineer', 'laboratory_director', 'cto', 'super_admin'] },
  { module: 'Scientific Documentation Lead', url: '/scientific-documentation-lead', permission: 'scientific_documentation_lead.view', roles: ['scientific_documentation_lead', 'laboratory_director', 'ceo', 'super_admin'] },
  { module: 'Experiment Validation Officer', url: '/experiment-validation-officer', permission: 'experiment_validation_officer.view', roles: ['experiment_validation_officer', 'laboratory_director', 'ceo', 'super_admin'] },
  { module: 'Lab Safety Officer', url: '/lab-safety-officer', permission: 'lab_safety_officer.view', roles: ['lab_safety_officer', 'laboratory_director', 'ceo', 'super_admin'] },

  // Trade + Commerce Division
  { module: 'Import Manager', url: '/import-manager', permission: 'import_manager.view', roles: ['import_manager', 'trade_director', 'ceo', 'super_admin'] },
  { module: 'Export Manager', url: '/export-manager', permission: 'export_manager.view', roles: ['export_manager', 'trade_director', 'ceo', 'super_admin'] },
  { module: 'Customs Broker', url: '/customs-broker', permission: 'customs_broker.view', roles: ['customs_broker', 'trade_director', 'ceo', 'super_admin'] },
  { module: 'Trade Analyst', url: '/trade-analyst', permission: 'trade_analyst.view', roles: ['trade_analyst', 'trade_director', 'ceo', 'super_admin'] },
  { module: 'Supply Chain Manager', url: '/supply-chain-manager', permission: 'supply_chain_manager.view', roles: ['supply_chain_manager', 'operations_director', 'coo', 'super_admin'] },
  { module: 'Distribution Manager', url: '/distribution-manager', permission: 'distribution_manager.view', roles: ['distribution_manager', 'supply_chain_manager', 'coo', 'super_admin'] },
  { module: 'Freight Manager', url: '/freight-manager', permission: 'freight_manager.view', roles: ['freight_manager', 'supply_chain_manager', 'coo', 'super_admin'] },
  { module: 'Global Sourcing Manager', url: '/global-sourcing-manager', permission: 'global_sourcing_manager.view', roles: ['global_sourcing_manager', 'trade_director', 'ceo', 'super_admin'] },
  { module: 'International Operations Lead', url: '/international-operations-lead', permission: 'international_operations_lead.view', roles: ['international_operations_lead', 'trade_director', 'ceo', 'super_admin'] },

  // Media + Influence Operations Division
  { module: 'Influencer Relations Manager', url: '/influencer-relations-manager', permission: 'influencer_relations_manager.view', roles: ['influencer_relations_manager', 'marketing_director', 'cmo', 'super_admin'] },
  { module: 'Digital Campaign Strategist', url: '/digital-campaign-strategist', permission: 'digital_campaign_strategist.view', roles: ['digital_campaign_strategist', 'marketing_director', 'cmo', 'super_admin'] },
  { module: 'Community Moderator', url: '/community-moderator', permission: 'community_moderator.view', roles: ['community_moderator', 'marketing_director', 'cmo', 'super_admin'] },
  { module: 'Reputation Manager', url: '/reputation-manager', permission: 'reputation_manager.view', roles: ['reputation_manager', 'marketing_director', 'cmo', 'super_admin'] },
  { module: 'Social Listening Analyst', url: '/social-listening-analyst', permission: 'social_listening_analyst.view', roles: ['social_listening_analyst', 'marketing_director', 'cmo', 'super_admin'] },
  { module: 'Press Secretary', url: '/press-secretary', permission: 'press_secretary.view', roles: ['press_secretary', 'communications_director', 'cmo', 'super_admin'] },
  { module: 'Media Relations Officer', url: '/media-relations-officer', permission: 'media_relations_officer.view', roles: ['media_relations_officer', 'communications_director', 'cmo', 'super_admin'] },
  { module: 'Brand Protection Officer', url: '/brand-protection-officer', permission: 'brand_protection_officer.view', roles: ['brand_protection_officer', 'legal_manager', 'ciso', 'super_admin'] },
  { module: 'Anti-Piracy Manager', url: '/anti-piracy-manager', permission: 'anti_piracy_manager.view', roles: ['anti_piracy_manager', 'brand_protection_officer', 'ciso', 'super_admin'] },

  // Root System Intelligence Division
  { module: 'Predictive Failure Engineer', url: '/predictive-failure-engineer', permission: 'predictive_failure_engineer.view', roles: ['predictive_failure_engineer', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Anomaly Detection Engineer', url: '/anomaly-detection-engineer', permission: 'anomaly_detection_engineer.view', roles: ['anomaly_detection_engineer', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'System DNA Analyst', url: '/system-dna-analyst', permission: 'system_dna_analyst.view', roles: ['system_dna_analyst', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Shadow System Detector', url: '/shadow-system-detector', permission: 'shadow_system_detector.view', roles: ['shadow_system_detector', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Root Trust Engineer', url: '/root-trust-engineer', permission: 'root_trust_engineer.view', roles: ['root_trust_engineer', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Universal Memory Fabric Admin', url: '/universal-memory-fabric-admin', permission: 'universal_memory_fabric_admin.view', roles: ['universal_memory_fabric_admin', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Execution Timeline Analyst', url: '/execution-timeline-analyst', permission: 'execution_timeline_analyst.view', roles: ['execution_timeline_analyst', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Autonomous Recovery Engineer', url: '/autonomous-recovery-engineer', permission: 'autonomous_recovery_engineer.view', roles: ['autonomous_recovery_engineer', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Root Forensic Intelligence Lead', url: '/root-forensic-intelligence-lead', permission: 'root_forensic_intelligence_lead.view', roles: ['root_forensic_intelligence_lead', 'platform_architect', 'cto', 'super_admin'] },

  // Universal Meta Operations Division
  { module: 'Meta Role Engine Admin', url: '/meta-role-engine-admin', permission: 'meta_role_engine_admin.view', roles: ['meta_role_engine_admin', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Temporal Engine Operator', url: '/temporal-engine-operator', permission: 'temporal_engine_operator.view', roles: ['temporal_engine_operator', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Reality Mirror Controller', url: '/reality-mirror-controller', permission: 'reality_mirror_controller.view', roles: ['reality_mirror_controller', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Interoperability Fabric Admin', url: '/interoperability-fabric-admin', permission: 'interoperability_fabric_admin.view', roles: ['interoperability_fabric_admin', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Continuity Matrix Supervisor', url: '/continuity-matrix-supervisor', permission: 'continuity_matrix_supervisor.view', roles: ['continuity_matrix_supervisor', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Transcendent Validation Officer', url: '/transcendent-validation-officer', permission: 'transcendent_validation_officer.view', roles: ['transcendent_validation_officer', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Meta Governance Lead', url: '/meta-governance-lead', permission: 'meta_governance_lead.view', roles: ['meta_governance_lead', 'platform_architect', 'ceo', 'super_admin'] },
  { module: 'Multiverse Environment Admin', url: '/multiverse-environment-admin', permission: 'multiverse_environment_admin.view', roles: ['multiverse_environment_admin', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Universal Sentinel Commander', url: '/universal-sentinel-commander', permission: 'universal_sentinel_commander.view', roles: ['universal_sentinel_commander', 'platform_architect', 'cto', 'super_admin'] },

  // Internal Platform Operations Division
  { module: 'Internal Tooling Manager', url: '/internal-tooling-manager', permission: 'internal_tooling_manager.view', roles: ['internal_tooling_manager', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Platform Support Engineer', url: '/platform-support-engineer', permission: 'platform_support_engineer.view', roles: ['platform_support_engineer', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'System Health Operator', url: '/system-health-operator', permission: 'system_health_operator.view', roles: ['system_health_operator', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Internal Incident Coordinator', url: '/internal-incident-coordinator', permission: 'internal_incident_coordinator.view', roles: ['internal_incident_coordinator', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Configuration Governance Admin', url: '/configuration-governance-admin', permission: 'configuration_governance_admin.view', roles: ['configuration_governance_admin', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Release Pipeline Supervisor', url: '/release-pipeline-supervisor', permission: 'release_pipeline_supervisor.view', roles: ['release_pipeline_supervisor', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Version Control Admin', url: '/version-control-admin', permission: 'version_control_admin.view', roles: ['version_control_admin', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Build Validation Engineer', url: '/build-validation-engineer', permission: 'build_validation_engineer.view', roles: ['build_validation_engineer', 'platform_architect', 'cto', 'super_admin'] },
  { module: 'Internal QA Commander', url: '/internal-qa-commander', permission: 'internal_qa_commander.view', roles: ['internal_qa_commander', 'platform_architect', 'cto', 'super_admin'] },

  // Knowledge + Document Intelligence Division
  { module: 'Knowledge Graph Engineer', url: '/knowledge-graph-engineer', permission: 'knowledge_graph_engineer.view', roles: ['knowledge_graph_engineer', 'data_director', 'cto', 'super_admin'] },
  { module: 'Documentation Engineer', url: '/documentation-engineer', permission: 'documentation_engineer.view', roles: ['documentation_engineer', 'data_director', 'cto', 'super_admin'] },
  { module: 'OCR Validation Officer', url: '/ocr-validation-officer', permission: 'ocr_validation_officer.view', roles: ['ocr_validation_officer', 'data_director', 'cto', 'super_admin'] },
  { module: 'Digital Archive Admin', url: '/digital-archive-admin', permission: 'digital_archive_admin.view', roles: ['digital_archive_admin', 'data_director', 'cto', 'super_admin'] },
  { module: 'Content Taxonomy Manager', url: '/content-taxonomy-manager', permission: 'content_taxonomy_manager.view', roles: ['content_taxonomy_manager', 'data_director', 'cto', 'super_admin'] },
  { module: 'Semantic Search Admin', url: '/semantic-search-admin', permission: 'semantic_search_admin.view', roles: ['semantic_search_admin', 'data_director', 'cto', 'super_admin'] },
  { module: 'Enterprise Search Engineer', url: '/enterprise-search-engineer', permission: 'enterprise_search_engineer.view', roles: ['enterprise_search_engineer', 'data_director', 'cto', 'super_admin'] },
  { module: 'Records Retention Officer', url: '/records-retention-officer', permission: 'records_retention_officer.view', roles: ['records_retention_officer', 'data_director', 'ceo', 'super_admin'] },
  { module: 'Document Forensics Analyst', url: '/document-forensics-analyst', permission: 'document_forensics_analyst.view', roles: ['document_forensics_analyst', 'data_director', 'ciso', 'super_admin'] },

  // Identity + Access Governance Division
  { module: 'Identity Federation Admin', url: '/identity-federation-admin', permission: 'identity_federation_admin.view', roles: ['identity_federation_admin', 'security_director', 'ciso', 'super_admin'] },
  { module: 'Directory Services Admin', url: '/directory-services-admin', permission: 'directory_services_admin.view', roles: ['directory_services_admin', 'security_director', 'ciso', 'super_admin'] },
  { module: 'Active Directory Admin', url: '/active-directory-admin', permission: 'active_directory_admin.view', roles: ['active_directory_admin', 'security_director', 'ciso', 'super_admin'] },
  { module: 'LDAP Admin', url: '/ldap-admin', permission: 'ldap_admin.view', roles: ['ldap_admin', 'security_director', 'ciso', 'super_admin'] },
  { module: 'Access Control Admin', url: '/access-control-admin', permission: 'access_control_admin.view', roles: ['access_control_admin', 'security_director', 'ciso', 'super_admin'] },
  { module: 'Role Reviewer', url: '/role-reviewer', permission: 'role_reviewer.view', roles: ['role_reviewer', 'security_director', 'ciso', 'super_admin'] },
  { module: 'Secrets Manager', url: '/secrets-manager', permission: 'secrets_manager.view', roles: ['secrets_manager', 'security_director', 'ciso', 'super_admin'] },
  { module: 'Key Management Admin', url: '/key-management-admin', permission: 'key_management_admin.view', roles: ['key_management_admin', 'security_director', 'ciso', 'super_admin'] },
  { module: 'Privileged Access Governance Lead', url: '/privileged-access-governance-lead', permission: 'privileged_access_governance_lead.view', roles: ['privileged_access_governance_lead', 'security_director', 'ciso', 'super_admin'] },

  // Global Communications Division
  { module: 'Email Admin', url: '/email-admin', permission: 'email_admin.view', roles: ['email_admin', 'communications_director', 'cmo', 'super_admin'] },
  { module: 'SMS Admin', url: '/sms-admin', permission: 'sms_admin.view', roles: ['sms_admin', 'communications_director', 'cmo', 'super_admin'] },
  { module: 'Push Notification Manager', url: '/push-notification-manager', permission: 'push_notification_manager.view', roles: ['push_notification_manager', 'communications_director', 'cto', 'super_admin'] },
  { module: 'VoIP Admin', url: '/voip-admin', permission: 'voip_admin.view', roles: ['voip_admin', 'communications_director', 'cto', 'super_admin'] },
  { module: 'Video Conference Manager', url: '/video-conference-manager', permission: 'video_conference_manager.view', roles: ['video_conference_manager', 'communications_director', 'cto', 'super_admin'] },
  { module: 'Live Chat Operations', url: '/live-chat-operations', permission: 'live_chat_operations.view', roles: ['live_chat_operations', 'communications_director', 'cmo', 'super_admin'] },
  { module: 'Communication Compliance Officer', url: '/communication-compliance-officer', permission: 'communication_compliance_officer.view', roles: ['communication_compliance_officer', 'legal_manager', 'ciso', 'super_admin'] },
  { module: 'Message Delivery Analyst', url: '/message-delivery-analyst', permission: 'message_delivery_analyst.view', roles: ['message_delivery_analyst', 'communications_director', 'cto', 'super_admin'] },
  { module: 'Alert Orchestration Engineer', url: '/alert-orchestration-engineer', permission: 'alert_orchestration_engineer.view', roles: ['alert_orchestration_engineer', 'platform_architect', 'cto', 'super_admin'] },

  // Edge + Distributed Compute Division
  { module: 'Edge Node Operator', url: '/edge-node-operator', permission: 'edge_node_operator.view', roles: ['edge_node_operator', 'infrastructure_director', 'cto', 'super_admin'] },
  { module: 'Distributed Systems Engineer', url: '/distributed-systems-engineer', permission: 'distributed_systems_engineer.view', roles: ['distributed_systems_engineer', 'infrastructure_director', 'cto', 'super_admin'] },
  { module: 'Service Mesh Admin', url: '/service-mesh-admin', permission: 'service_mesh_admin.view', roles: ['service_mesh_admin', 'infrastructure_director', 'cto', 'super_admin'] },
  { module: 'Load Balancer Operator', url: '/load-balancer-operator', permission: 'load_balancer_operator.view', roles: ['load_balancer_operator', 'infrastructure_director', 'cto', 'super_admin'] },
  { module: 'API Proxy Admin', url: '/api-proxy-admin', permission: 'api_proxy_admin.view', roles: ['api_proxy_admin', 'infrastructure_director', 'cto', 'super_admin'] },
  { module: 'Traffic Routing Engineer', url: '/traffic-routing-engineer', permission: 'traffic_routing_engineer.view', roles: ['traffic_routing_engineer', 'infrastructure_director', 'cto', 'super_admin'] },
  { module: 'Replication Engineer', url: '/replication-engineer', permission: 'replication_engineer.view', roles: ['replication_engineer', 'infrastructure_director', 'cto', 'super_admin'] },
  { module: 'Consistency Engineer', url: '/consistency-engineer', permission: 'consistency_engineer.view', roles: ['consistency_engineer', 'infrastructure_director', 'cto', 'super_admin'] },
  { module: 'Edge Security Analyst', url: '/edge-security-analyst', permission: 'edge_security_analyst.view', roles: ['edge_security_analyst', 'infrastructure_director', 'ciso', 'super_admin'] },

  // Platform Governance + Ethics Division
  { module: 'Governance Commander', url: '/governance-commander', permission: 'governance_commander.view', roles: ['governance_commander', 'governance_director', 'ceo', 'super_admin'] },
  { module: 'Policy Enforcement Director', url: '/policy-enforcement-director', permission: 'policy_enforcement_director.view', roles: ['policy_enforcement_director', 'governance_director', 'ceo', 'super_admin'] },
  { module: 'AI Ethics Reviewer', url: '/ai-ethics-reviewer', permission: 'ai_ethics_reviewer.view', roles: ['ai_ethics_reviewer', 'governance_director', 'cto', 'super_admin'] },
  { module: 'Trust & Safety Analyst', url: '/trust-safety-analyst', permission: 'trust_safety_analyst.view', roles: ['trust_safety_analyst', 'governance_director', 'cmo', 'super_admin'] },
  { module: 'Digital Rights Officer', url: '/digital-rights-officer', permission: 'digital_rights_officer.view', roles: ['digital_rights_officer', 'legal_manager', 'ceo', 'super_admin'] },
  { module: 'Privacy Manager', url: '/privacy-manager', permission: 'privacy_manager.view', roles: ['privacy_manager', 'governance_director', 'ceo', 'super_admin'] },
  { module: 'Data Protection Officer', url: '/data-protection-officer', permission: 'data_protection_officer.view', roles: ['data_protection_officer', 'governance_director', 'ceo', 'super_admin'] },
  { module: 'Sovereign Data Officer', url: '/sovereign-data-officer', permission: 'sovereign_data_officer.view', roles: ['sovereign_data_officer', 'governance_director', 'ceo', 'super_admin'] },

  // Advanced Forensics + Audit Division
  { module: 'Digital Forensics Lead', url: '/digital-forensics-lead', permission: 'digital_forensics_lead.view', roles: ['digital_forensics_lead', 'forensics_director', 'ciso', 'super_admin'] },
  { module: 'Forensic Reconstruction Analyst', url: '/forensic-reconstruction-analyst', permission: 'forensic_reconstruction_analyst.view', roles: ['forensic_reconstruction_analyst', 'forensics_director', 'ciso', 'super_admin'] },
  { module: 'Cryptographic Audit Engineer', url: '/cryptographic-audit-engineer', permission: 'cryptographic_audit_engineer.view', roles: ['cryptographic_audit_engineer', 'forensics_director', 'ciso', 'super_admin'] },
  { module: 'Incident Timeline Analyst', url: '/incident-timeline-analyst', permission: 'incident_timeline_analyst.view', roles: ['incident_timeline_analyst', 'forensics_director', 'ciso', 'super_admin'] },
  { module: 'Tamper Detection Officer', url: '/tamper-detection-officer', permission: 'tamper_detection_officer.view', roles: ['tamper_detection_officer', 'forensics_director', 'ciso', 'super_admin'] },
  { module: 'Audit Trail Governor', url: '/audit-trail-governor', permission: 'audit_trail_governor.view', roles: ['audit_trail_governor', 'forensics_director', 'ciso', 'super_admin'] },
  { module: 'Compliance Forensics Reviewer', url: '/compliance-forensics-reviewer', permission: 'compliance_forensics_reviewer.view', roles: ['compliance_forensics_reviewer', 'forensics_director', 'ciso', 'super_admin'] },
  { module: 'Evidence Preservation Officer', url: '/evidence-preservation-officer', permission: 'evidence_preservation_officer.view', roles: ['evidence_preservation_officer', 'forensics_director', 'ciso', 'super_admin'] },
  { module: 'Root Investigation Commander', url: '/root-investigation-commander', permission: 'root_investigation_commander.view', roles: ['root_investigation_commander', 'forensics_director', 'ciso', 'super_admin'] },

  // Absolute Root Oversight Division
  { module: 'Universal Access Admin', url: '/universal-access-admin', permission: 'universal_access_admin.view', roles: ['universal_access_admin', 'root_admin', 'super_admin'] },
  { module: 'Master Controller', url: '/master-controller', permission: 'master_controller.view', roles: ['master_controller', 'root_admin', 'super_admin'] },
  { module: 'Universal Governance Council', url: '/universal-governance-council', permission: 'universal_governance_council.view', roles: ['universal_governance_council', 'root_admin', 'super_admin'] },
  { module: 'Command Authority Board', url: '/command-authority-board', permission: 'command_authority_board.view', roles: ['command_authority_board', 'root_admin', 'super_admin'] },
  { module: 'Root Execution Authority', url: '/root-execution-authority', permission: 'root_execution_authority.view', roles: ['root_execution_authority', 'root_admin', 'super_admin'] },
  { module: 'Absolute System Oversight', url: '/absolute-system-oversight', permission: 'absolute_system_oversight.view', roles: ['absolute_system_oversight', 'root_admin', 'super_admin'] },
];

/**
 * Get modules accessible by role
 */
export function getAccessibleModulesByRole(roleSlug: string): string[] {
  return modulePermissions
    .filter(mp => mp.roles.includes(roleSlug))
    .map(mp => mp.url);
}

/**
 * Check if user has access to module
 */
export function hasModuleAccess(roleSlug: string, moduleUrl: string): boolean {
  const module = modulePermissions.find(mp => mp.url === moduleUrl);
  if (!module) return false;
  return module.roles.includes(roleSlug);
}

/**
 * Get permission for module
 */
export function getModulePermission(moduleUrl: string): string | null {
  const module = modulePermissions.find(mp => mp.url === moduleUrl);
  return module ? module.permission : null;
}
