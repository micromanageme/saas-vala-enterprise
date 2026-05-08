# Core Business Modules Architecture
## Phase 06 - ERP, CRM, HRMS, Finance, Marketplace, CMS, Support

---

## Overview

Enterprise-grade business modules covering ERP, CRM, HRMS, Finance, Marketplace, CMS, and Support with full integration, multi-tenancy, and role-based access.

---

## ERP Module

### Inventory Management

```typescript
// src/lib/erp/inventory.ts
import { prisma } from '@/lib/db';

export class InventoryService {
  /**
   * Create inventory item
   */
  static async createItem(data: {
    sku: string;
    name: string;
    description?: string;
    category: string;
    unitOfMeasure: string;
    cost: number;
    price: number;
    quantity: number;
    reorderLevel: number;
    warehouseId: string;
    tenantId: string;
  }) {
    return prisma.inventoryItem.create({
      data: {
        ...data,
        status: this.calculateStatus(data.quantity, data.reorderLevel),
      },
    });
  }

  /**
   * Update inventory quantity
   */
  static async updateQuantity(
    itemId: string,
    quantity: number,
    type: 'add' | 'subtract' | 'set'
  ) {
    const item = await prisma.inventoryItem.findUnique({
      where: { id: itemId },
    });

    if (!item) throw new Error('Item not found');

    const newQuantity =
      type === 'set'
        ? quantity
        : type === 'add'
        ? item.quantity + quantity
        : item.quantity - quantity;

    return prisma.inventoryItem.update({
      where: { id: itemId },
      data: {
        quantity: newQuantity,
        status: this.calculateStatus(newQuantity, item.reorderLevel),
      },
    });
  }

  /**
   * Calculate inventory status
   */
  private static calculateStatus(quantity: number, reorderLevel: number): string {
    if (quantity <= 0) return 'out_of_stock';
    if (quantity < reorderLevel) return 'low_stock';
    return 'in_stock';
  }

  /**
   * Get low stock items
   */
  static async getLowStockItems(tenantId: string) {
    return prisma.inventoryItem.findMany({
      where: {
        tenantId,
        status: 'low_stock',
      },
    });
  }

  /**
   * Get inventory value
   */
  static async getInventoryValue(tenantId: string) {
    const items = await prisma.inventoryItem.findMany({
      where: { tenantId },
    });

    return items.reduce((total, item) => {
      return total + item.quantity * item.cost;
    }, 0);
  }
}
```

### Warehouse Management

```typescript
// src/lib/erp/warehouse.ts
export class WarehouseService {
  /**
   * Create warehouse
   */
  static async createWarehouse(data: {
    name: string;
    code: string;
    address: any;
    capacity: number;
    tenantId: string;
  }) {
    return prisma.warehouse.create({
      data,
    });
  }

  /**
   * Transfer stock between warehouses
   */
  static async transferStock(data: {
    itemId: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    quantity: number;
    userId: string;
  }) {
    // Create transfer record
    const transfer = await prisma.stockTransfer.create({
      data: {
        itemId: data.itemId,
        fromWarehouseId: data.fromWarehouseId,
        toWarehouseId: data.toWarehouseId,
        quantity: data.quantity,
        status: 'pending',
        initiatedBy: data.userId,
      },
    });

    // Update source warehouse
    await InventoryService.updateQuantity(
      data.itemId,
      data.quantity,
      'subtract'
    );

    return transfer;
  }

  /**
   * Complete stock transfer
   */
  static async completeTransfer(transferId: string) {
    const transfer = await prisma.stockTransfer.findUnique({
      where: { id: transferId },
    });

    if (!transfer) throw new Error('Transfer not found');

    // Update destination warehouse
    await InventoryService.updateQuantity(
      transfer.itemId,
      transfer.quantity,
      'add'
    );

    return prisma.stockTransfer.update({
      where: { id: transferId },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });
  }
}
```

### Procurement

```typescript
// src/lib/erp/procurement.ts
export class ProcurementService {
  /**
   * Create purchase order
   */
  static async createPurchaseOrder(data: {
    supplierId: string;
    items: Array<{
      itemId: string;
      quantity: number;
      unitPrice: number;
    }>;
    expectedDeliveryDate: Date;
    tenantId: string;
    userId: string;
  }) {
    const total = data.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    return prisma.purchaseOrder.create({
      data: {
        supplierId: data.supplierId,
        expectedDeliveryDate: data.expectedDeliveryDate,
        total,
        status: 'pending',
        tenantId: data.tenantId,
        createdBy: data.userId,
        items: {
          create: data.items,
        },
      },
    });
  }

  /**
   * Approve purchase order
   */
  static async approvePurchaseOrder(orderId: string, approverId: string) {
    return prisma.purchaseOrder.update({
      where: { id: orderId },
      data: {
        status: 'approved',
        approvedBy: approverId,
        approvedAt: new Date(),
      },
    });
  }

  /**
   * Receive purchase order
   */
  static async receivePurchaseOrder(orderId: string, userId: string) {
    const order = await prisma.purchaseOrder.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new Error('Order not found');

    // Update inventory for each item
    for (const item of order.items) {
      await InventoryService.updateQuantity(item.itemId, item.quantity, 'add');
    }

    return prisma.purchaseOrder.update({
      where: { id: orderId },
      data: {
        status: 'received',
        receivedBy: userId,
        receivedAt: new Date(),
      },
    });
  }
}
```

### Manufacturing

```typescript
// src/lib/erp/manufacturing.ts
export class ManufacturingService {
  /**
   * Create bill of materials
   */
  static async createBOM(data: {
    productId: string;
    components: Array<{
      itemId: string;
      quantity: number;
    }>;
    tenantId: string;
  }) {
    return prisma.billOfMaterials.create({
      data: {
        productId: data.productId,
        tenantId: data.tenantId,
        components: {
          create: data.components,
        },
      },
    });
  }

  /**
   * Create production order
   */
  static async createProductionOrder(data: {
    productId: string;
    quantity: number;
    scheduledStartDate: Date;
    scheduledEndDate: Date;
    tenantId: string;
    userId: string;
  }) {
    // Check if BOM exists
    const bom = await prisma.billOfMaterials.findUnique({
      where: { productId: data.productId },
      include: { components: true },
    });

    if (!bom) throw new Error('No BOM found for product');

    // Check component availability
    for (const component of bom.components) {
      const item = await prisma.inventoryItem.findUnique({
        where: { id: component.itemId },
      });

      if (!item || item.quantity < component.quantity * data.quantity) {
        throw new Error(`Insufficient stock for component ${component.itemId}`);
      }
    }

    // Reserve components
    for (const component of bom.components) {
      await InventoryService.updateQuantity(
        component.itemId,
        component.quantity * data.quantity,
        'subtract'
      );
    }

    return prisma.productionOrder.create({
      data: {
        productId: data.productId,
        quantity: data.quantity,
        scheduledStartDate: data.scheduledStartDate,
        scheduledEndDate: data.scheduledEndDate,
        status: 'planned',
        tenantId: data.tenantId,
        createdBy: data.userId,
      },
    });
  }

  /**
   * Complete production order
   */
  static async completeProductionOrder(orderId: string, userId: string) {
    const order = await prisma.productionOrder.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new Error('Order not found');

    // Add finished goods to inventory
    await InventoryService.updateQuantity(
      order.productId,
      order.quantity,
      'add'
    );

    return prisma.productionOrder.update({
      where: { id: orderId },
      data: {
        status: 'completed',
        completedBy: userId,
        completedAt: new Date(),
      },
    });
  }
}
```

### Logistics

```typescript
// src/lib/erp/logistics.ts
export class LogisticsService {
  /**
   * Create shipment
   */
  static async createShipment(data: {
    orderId: string;
    carrier: string;
    trackingNumber?: string;
    estimatedDelivery: Date;
    tenantId: string;
  }) {
    return prisma.shipment.create({
      data,
    });
  }

  /**
   * Update shipment status
   */
  static async updateShipmentStatus(
    shipmentId: string,
    status: 'pending' | 'shipped' | 'in_transit' | 'delivered' | 'returned',
    location?: string
  ) {
    return prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        status,
        currentLocation: location,
        statusHistory: {
          create: {
            status,
            location,
            timestamp: new Date(),
          },
        },
      },
    });
  }

  /**
   * Track shipment
   */
  static async trackShipment(shipmentId: string) {
    return prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        statusHistory: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });
  }
}
```

---

## CRM Module

### Lead Management

```typescript
// src/lib/crm/leads.ts
export class LeadService {
  /**
   * Create lead
   */
  static async createLead(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    source: string;
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
    tenantId: string;
    userId: string;
  }) {
    return prisma.lead.create({
      data: {
        ...data,
        assignedTo: data.userId,
      },
    });
  }

  /**
   * Update lead status
   */
  static async updateStatus(leadId: string, status: string, userId: string) {
    return prisma.lead.update({
      where: { id: leadId },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            changedBy: userId,
            changedAt: new Date(),
          },
        },
      },
    });
  }

  /**
   * Convert lead to deal
   */
  static async convertToDeal(leadId: string, dealData: any) {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) throw new Error('Lead not found');

    const deal = await prisma.deal.create({
      data: {
        ...dealData,
        contactId: lead.id,
        tenantId: lead.tenantId,
      },
    });

    await prisma.lead.update({
      where: { id: leadId },
      data: { status: 'converted' },
    });

    return deal;
  }
}
```

### Deal Management

```typescript
// src/lib/crm/deals.ts
export class DealService {
  /**
   * Create deal
   */
  static async createDeal(data: {
    title: string;
    value: number;
    currency: string;
    stage: string;
    expectedCloseDate: Date;
    contactId: string;
    tenantId: string;
    userId: string;
  }) {
    return prisma.deal.create({
      data: {
        ...data,
        assignedTo: data.userId,
      },
    });
  }

  /**
   * Update deal stage
   */
  static async updateStage(dealId: string, stage: string, userId: string) {
    return prisma.deal.update({
      where: { id: dealId },
      data: {
        stage,
        stageHistory: {
          create: {
            stage,
            changedBy: userId,
            changedAt: new Date(),
          },
        },
      },
    });
  }

  /**
   * Get pipeline summary
   */
  static async getPipelineSummary(tenantId: string) {
    const deals = await prisma.deal.findMany({
      where: { tenantId, status: 'active' },
    });

    const summary = deals.reduce((acc, deal) => {
      if (!acc[deal.stage]) {
        acc[deal.stage] = { count: 0, value: 0 };
      }
      acc[deal.stage].count++;
      acc[deal.stage].value += deal.value;
      return acc;
    }, {} as Record<string, { count: number; value: number }>);

    return summary;
  }
}
```

### Follow-up Management

```typescript
// src/lib/crm/followups.ts
export class FollowupService {
  /**
   * Create follow-up
   */
  static async createFollowup(data: {
    contactId: string;
    type: 'call' | 'email' | 'meeting' | 'task';
    subject: string;
    notes?: string;
    dueDate: Date;
    tenantId: string;
    userId: string;
  }) {
    return prisma.followup.create({
      data: {
        ...data,
        assignedTo: data.userId,
        status: 'pending',
      },
    });
  }

  /**
   * Complete follow-up
   */
  static async completeFollowup(followupId: string, notes?: string) {
    return prisma.followup.update({
      where: { id: followupId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        notes,
      },
    });
  }

  /**
   * Get overdue follow-ups
   */
  static async getOverdueFollowups(tenantId: string) {
    return prisma.followup.findMany({
      where: {
        tenantId,
        status: 'pending',
        dueDate: { lt: new Date() },
      },
      include: { contact: true },
    });
  }
}
```

---

## HRMS Module

### Attendance Management

```typescript
// src/lib/hrms/attendance.ts
export class AttendanceService {
  /**
   * Clock in
   */
  static async clockIn(userId: string, data: { latitude?: number; longitude?: number; }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already clocked in today
    const existing = await prisma.attendance.findFirst({
      where: {
        userId,
        date: today,
      },
    });

    if (existing) {
      throw new Error('Already clocked in today');
    }

    return prisma.attendance.create({
      data: {
        userId,
        date: today,
        clockIn: new Date(),
        location: data.latitude && data.longitude ? {
          latitude: data.latitude,
          longitude: data.longitude,
        } : undefined,
        status: 'present',
      },
    });
  }

  /**
   * Clock out
   */
  static async clockOut(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findFirst({
      where: {
        userId,
        date: today,
      },
    });

    if (!attendance) {
      throw new Error('No clock-in record found for today');
    }

    const clockOut = new Date();
    const hoursWorked =
      (clockOut.getTime() - attendance.clockIn.getTime()) / (1000 * 60 * 60);

    return prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        clockOut,
        hoursWorked,
      },
    });
  }

  /**
   * Get attendance summary
   */
  static async getAttendanceSummary(userId: string, startDate: Date, endDate: Date) {
    const records = await prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalHours = records.reduce((sum, r) => sum + (r.hoursWorked || 0), 0);
    const presentDays = records.filter(r => r.status === 'present').length;
    const absentDays = records.filter(r => r.status === 'absent').length;

    return {
      totalHours,
      presentDays,
      absentDays,
      records,
    };
  }
}
```

### Payroll Management

```typescript
// src/lib/hrms/payroll.ts
export class PayrollService {
  /**
   * Calculate payroll
   */
  static async calculatePayroll(data: {
    userId: string;
    periodStart: Date;
    periodEnd: Date;
    tenantId: string;
  }) {
    // Get employee details
    const employee = await prisma.employee.findFirst({
      where: { userId: data.userId },
    });

    if (!employee) throw new Error('Employee not found');

    // Get attendance for period
    const attendance = await AttendanceService.getAttendanceSummary(
      data.userId,
      data.periodStart,
      data.periodEnd
    );

    // Calculate base salary
    const dailyRate = employee.baseSalary / 30;
    const basePay = dailyRate * attendance.presentDays;

    // Calculate overtime
    const overtimeHours = Math.max(0, attendance.totalHours - 160); // 40 hours/week * 4 weeks
    const overtimeRate = dailyRate / 8 * 1.5; // 1.5x hourly rate
    const overtimePay = overtimeHours * overtimeRate;

    // Calculate deductions
    const tax = (basePay + overtimePay) * 0.2; // 20% tax
    const insurance = employee.baseSalary * 0.05; // 5% insurance

    const grossPay = basePay + overtimePay;
    const totalDeductions = tax + insurance;
    const netPay = grossPay - totalDeductions;

    return prisma.payroll.create({
      data: {
        userId: data.userId,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        basePay,
        overtimePay,
        grossPay,
        tax,
        insurance,
        totalDeductions,
        netPay,
        tenantId: data.tenantId,
        status: 'pending',
      },
    });
  }

  /**
   * Process payroll
   */
  static async processPayroll(payrollId: string, approverId: string) {
    return prisma.payroll.update({
      where: { id: payrollId },
      data: {
        status: 'processed',
        approvedBy: approverId,
        approvedAt: new Date(),
      },
    });
  }
}
```

### Recruitment

```typescript
// src/lib/hrms/recruitment.ts
export class RecruitmentService {
  /**
   * Create job posting
   */
  static async createJobPosting(data: {
    title: string;
    description: string;
    requirements: string;
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    employmentType: 'full_time' | 'part_time' | 'contract' | 'internship';
    tenantId: string;
  }) {
    return prisma.jobPosting.create({
      data: {
        ...data,
        status: 'active',
      },
    });
  }

  /**
   * Create application
   */
  static async createApplication(data: {
    jobPostingId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    resumeUrl: string;
    coverLetter?: string;
  }) {
    return prisma.jobApplication.create({
      data: {
        ...data,
        status: 'submitted',
        submittedAt: new Date(),
      },
    });
  }

  /**
   * Update application status
   */
  static async updateApplicationStatus(
    applicationId: string,
    status: 'submitted' | 'reviewed' | 'interview' | 'offered' | 'rejected' | 'hired',
    notes?: string
  ) {
    return prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        status,
        notes,
        statusHistory: {
          create: {
            status,
            notes,
            changedAt: new Date(),
          },
        },
      },
    });
  }
}
```

### Leave Management

```typescript
// src/lib/hrms/leave.ts
export class LeaveService {
  /**
   * Request leave
   */
  static async requestLeave(data: {
    userId: string;
    type: 'sick' | 'vacation' | 'personal' | 'unpaid';
    startDate: Date;
    endDate: Date;
    reason?: string;
    tenantId: string;
  }) {
    const days = Math.ceil(
      (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

    return prisma.leaveRequest.create({
      data: {
        ...data,
        days,
        status: 'pending',
      },
    });
  }

  /**
   * Approve leave request
   */
  static async approveLeave(requestId: string, approverId: string) {
    return prisma.leaveRequest.update({
      where: { id: requestId },
      data: {
        status: 'approved',
        approvedBy: approverId,
        approvedAt: new Date(),
      },
    });
  }

  /**
   * Get leave balance
   */
  static async getLeaveBalance(userId: string, year: number) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);

    const requests = await prisma.leaveRequest.findMany({
      where: {
        userId,
        startDate: { gte: startOfYear },
        endDate: { lte: endOfYear },
        status: 'approved',
      },
    });

    const usedDays = requests.reduce((sum, r) => sum + r.days, 0);
    const totalDays = 30; // Standard 30 days per year
    const remainingDays = totalDays - usedDays;

    return {
      totalDays,
      usedDays,
      remainingDays,
    };
  }
}
```

### Performance Appraisal

```typescript
// src/lib/hrms/appraisal.ts
export class AppraisalService {
  /**
   * Create appraisal
   */
  static async createAppraisal(data: {
    userId: string;
    period: string;
    reviewerId: string;
    tenantId: string;
  }) {
    return prisma.appraisal.create({
      data: {
        ...data,
        status: 'pending',
      },
    });
  }

  /**
   * Submit appraisal
   */
  static async submitAppraisal(
    appraisalId: string,
    data: {
      rating: number;
      strengths?: string;
      areasForImprovement?: string;
      goals?: string;
      comments?: string;
    }
  ) {
    return prisma.appraisal.update({
      where: { id: appraisalId },
      data: {
        ...data,
        status: 'completed',
        completedAt: new Date(),
      },
    });
  }
}
```

---

## Finance Module

### Accounting

```typescript
// src/lib/finance/accounting.ts
export class AccountingService {
  /**
   * Create journal entry
   */
  static async createJournalEntry(data: {
    date: Date;
    description: string;
    lines: Array<{
      accountId: string;
      debit: number;
      credit: number;
    }>;
    tenantId: string;
    userId: string;
  }) {
    // Validate debits equal credits
    const totalDebit = data.lines.reduce((sum, l) => sum + l.debit, 0);
    const totalCredit = data.lines.reduce((sum, l) => sum + l.credit, 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new Error('Debits must equal credits');
    }

    return prisma.journalEntry.create({
      data: {
        date: data.date,
        description: data.description,
        tenantId: data.tenantId,
        createdBy: data.userId,
        lines: {
          create: data.lines,
        },
      },
    });
  }

  /**
   * Get trial balance
   */
  static async getTrialBalance(tenantId: string, asOfDate: Date) {
    const accounts = await prisma.account.findMany({
      where: { tenantId },
      include: {
        lines: {
          where: {
            journalEntry: {
              date: { lte: asOfDate },
            },
          },
        },
      },
    });

    return accounts.map((account) => {
      const debit = account.lines.reduce((sum, l) => sum + l.debit, 0);
      const credit = account.lines.reduce((sum, l) => sum + l.credit, 0);
      const balance = account.type === 'asset' || account.type === 'expense'
        ? debit - credit
        : credit - debit;

      return {
        account: account.name,
        accountNumber: account.number,
        type: account.type,
        debit,
        credit,
        balance,
      };
    });
  }
}
```

### Invoices

```typescript
// src/lib/finance/invoices.ts
export class InvoiceService {
  /**
   * Create invoice
   */
  static async createInvoice(data: {
    customerId: string;
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      taxRate?: number;
    }>;
    dueDate: Date;
    tenantId: string;
    userId: string;
  }) {
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const tax = data.items.reduce(
      (sum, item) =>
        sum + item.quantity * item.unitPrice * ((item.taxRate || 0) / 100),
      0
    );
    const total = subtotal + tax;

    return prisma.invoice.create({
      data: {
        customerId: data.customerId,
        dueDate: data.dueDate,
        subtotal,
        tax,
        total,
        status: 'draft',
        tenantId: data.tenantId,
        createdBy: data.userId,
        items: {
          create: data.items,
        },
      },
    });
  }

  /**
   * Send invoice
   */
  static async sendInvoice(invoiceId: string) {
    return prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'sent',
        sentAt: new Date(),
      },
    });
  }

  /**
   * Record payment
   */
  static async recordPayment(invoiceId: string, data: {
    amount: number;
    method: string;
    reference?: string;
    userId: string;
  }) {
    const payment = await prisma.payment.create({
      data: {
        invoiceId,
        amount: data.amount,
        method: data.method,
        reference: data.reference,
        status: 'completed',
        receivedBy: data.userId,
        receivedAt: new Date(),
      },
    });

    // Update invoice status
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { payments: true },
    });

    if (invoice) {
      const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
      const status = totalPaid >= invoice.total ? 'paid' : 'partial';

      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status },
      });
    }

    return payment;
  }
}
```

### Billing

```typescript
// src/lib/finance/billing.ts
export class BillingService {
  /**
   * Generate recurring bill
   */
  static async generateBill(data: {
    customerId: string;
    subscriptionId: string;
    amount: number;
    dueDate: Date;
    tenantId: string;
  }) {
    return prisma.bill.create({
      data: {
        ...data,
        status: 'pending',
      },
    });
  }

  /**
   * Process payment
   */
  static async processPayment(billId: string, paymentMethodId: string) {
    // Integrate with payment gateway (Stripe, etc.)
    const bill = await prisma.bill.findUnique({
      where: { id: billId },
    });

    if (!bill) throw new Error('Bill not found');

    // Simulate payment processing
    const success = Math.random() > 0.1; // 90% success rate

    return prisma.payment.create({
      data: {
        billId,
        amount: bill.amount,
        method: 'card',
        status: success ? 'completed' : 'failed',
        processedAt: new Date(),
      },
    });
  }
}
```

### Tax

```typescript
// src/lib/finance/tax.ts
export class TaxService {
  /**
   * Calculate tax
   */
  static async calculateTax(amount: number, taxRate: number, jurisdiction: string) {
    return {
      amount: amount * (taxRate / 100),
      rate: taxRate,
      jurisdiction,
    };
  }

  /**
   * Generate tax report
   */
  static async generateTaxReport(tenantId: string, startDate: Date, endDate: Date) {
    const invoices = await prisma.invoice.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalTax = invoices.reduce((sum, inv) => sum + inv.tax, 0);
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);

    return {
      totalTax,
      totalRevenue,
      invoiceCount: invoices.length,
      invoices,
    };
  }
}
```

### Treasury

```typescript
// src/lib/finance/treasury.ts
export class TreasuryService {
  /**
   * Create bank account
   */
  static async createBankAccount(data: {
    bankName: string;
    accountNumber: string;
    accountType: 'checking' | 'savings';
    balance: number;
    currency: string;
    tenantId: string;
  }) {
    return prisma.bankAccount.create({
      data,
    });
  }

  /**
   * Record transaction
   */
  static async recordTransaction(data: {
    accountId: string;
    type: 'debit' | 'credit';
    amount: number;
    description: string;
    reference?: string;
    tenantId: string;
  }) {
    const transaction = await prisma.bankTransaction.create({
      data: {
        ...data,
        date: new Date(),
        status: 'completed',
      },
    });

    // Update account balance
    const account = await prisma.bankAccount.findUnique({
      where: { id: data.accountId },
    });

    if (account) {
      const newBalance =
        data.type === 'credit'
          ? account.balance + data.amount
          : account.balance - data.amount;

      await prisma.bankAccount.update({
        where: { id: data.accountId },
        data: { balance: newBalance },
      });
    }

    return transaction;
  }
}
```

---

## Marketplace Module

### Vendors

```typescript
// src/lib/marketplace/vendors.ts
export class VendorService {
  /**
   * Create vendor
   */
  static async createVendor(data: {
    name: string;
    email: string;
    phone?: string;
    address?: any;
    taxId?: string;
    paymentTerms?: string;
    tenantId: string;
  }) {
    return prisma.vendor.create({
      data,
    });
  }

  /**
   * Update vendor status
   */
  static async updateStatus(vendorId: string, status: 'active' | 'inactive' | 'suspended') {
    return prisma.vendor.update({
      where: { id: vendorId },
      data: { status },
    });
  }
}
```

### Merchants

```typescript
// src/lib/marketplace/merchants.ts
export class MerchantService {
  /**
   * Create merchant
   */
  static async createMerchant(data: {
    userId: string;
    businessName: string;
    description?: string;
    categories: string[];
    tenantId: string;
  }) {
    return prisma.merchant.create({
      data: {
        ...data,
        status: 'pending',
      },
    });
  }

  /**
   * Approve merchant
   */
  static async approveMerchant(merchantId: string) {
    return prisma.merchant.update({
      where: { id: merchantId },
      data: {
        status: 'active',
        approvedAt: new Date(),
      },
    });
  }
}
```

### Products

```typescript
// src/lib/marketplace/products.ts
export class ProductService {
  /**
   * Create product
   */
  static async createProduct(data: {
    name: string;
    description?: string;
    price: number;
    currency: string;
    category: string;
    images?: string[];
    merchantId: string;
    tenantId: string;
  }) {
    return prisma.product.create({
      data: {
        ...data,
        status: 'active',
      },
    });
  }

  /**
   * Search products
   */
  static async searchProducts(query: string, filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    return prisma.product.findMany({
      where: {
        AND: [
          { status: 'active' },
          filters?.category ? { category: filters.category } : {},
          filters?.minPrice ? { price: { gte: filters.minPrice } } : {},
          filters?.maxPrice ? { price: { lte: filters.maxPrice } } : {},
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
    });
  }
}
```

### Orders

```typescript
// src/lib/marketplace/orders.ts
export class OrderService {
  /**
   * Create order
   */
  static async createOrder(data: {
    customerId: string;
    items: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
    }>;
    shippingAddress: any;
    billingAddress?: any;
    tenantId: string;
  }) {
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const tax = subtotal * 0.1; // 10% tax
    const shipping = 10; // Flat rate
    const total = subtotal + tax + shipping;

    return prisma.order.create({
      data: {
        customerId: data.customerId,
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress || data.shippingAddress,
        status: 'pending',
        tenantId: data.tenantId,
        items: {
          create: data.items,
        },
      },
    });
  }

  /**
   * Update order status
   */
  static async updateStatus(orderId: string, status: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            timestamp: new Date(),
          },
        },
      },
    });
  }
}
```

### Commissions

```typescript
// src/lib/marketplace/commissions.ts
export class CommissionService {
  /**
   * Calculate commission
   */
  static async calculateCommission(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new Error('Order not found');

    const commissionRate = 0.1; // 10% commission
    const commissionAmount = order.total * commissionRate;

    return prisma.commission.create({
      data: {
        orderId,
        amount: commissionAmount,
        rate: commissionRate,
        status: 'pending',
      },
    });
  }

  /**
   * Payout commission
   */
  static async payoutCommission(commissionId: string) {
    return prisma.commission.update({
      where: { id: commissionId },
      data: {
        status: 'paid',
        paidAt: new Date(),
      },
    });
  }
}
```

---

## CMS Module

```typescript
// src/lib/cms/website.ts
export class WebsiteService {
  /**
   * Create page
   */
  static async createPage(data: {
    title: string;
    slug: string;
    content: string;
    metaTitle?: string;
    metaDescription?: string;
    status: 'draft' | 'published';
    tenantId: string;
  }) {
    return prisma.page.create({
      data,
    });
  }

  /**
   * Update page
   */
  static async updatePage(pageId: string, data: any) {
    return prisma.page.update({
      where: { id: pageId },
      data,
    });
  }
}
```

```typescript
// src/lib/cms/blogs.ts
export class BlogService {
  /**
   * Create blog post
   */
  static async createPost(data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    authorId: string;
    categories?: string[];
    tags?: string[];
    status: 'draft' | 'published';
    publishedAt?: Date;
    tenantId: string;
  }) {
    return prisma.blogPost.create({
      data,
    });
  }

  /**
   * Get published posts
   */
  static async getPublishedPosts(tenantId: string, limit = 10) {
    return prisma.blogPost.findMany({
      where: {
        tenantId,
        status: 'published',
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }
}
```

```typescript
// src/lib/cms/seo.ts
export class SEOService {
  /**
   * Generate sitemap
   */
  static async generateSitemap(tenantId: string) {
    const pages = await prisma.page.findMany({
      where: { tenantId, status: 'published' },
      select: { slug: true, updatedAt: true },
    });

    const posts = await prisma.blogPost.findMany({
      where: { tenantId, status: 'published' },
      select: { slug: true, updatedAt: true },
    });

    return {
      pages,
      posts,
    };
  }

  /**
   * Generate robots.txt
   */
  static generateRobotsTxt(allowCrawling: boolean = true) {
    if (allowCrawling) {
      return `User-agent: *\nAllow: /\nSitemap: /sitemap.xml`;
    }
    return `User-agent: *\nDisallow: /`;
  }
}
```

---

## Support Module

```typescript
// src/lib/support/tickets.ts
export class TicketService {
  /**
   * Create ticket
   */
  static async createTicket(data: {
    subject: string;
    description: string;
    category?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    customerId: string;
    tenantId: string;
  }) {
    return prisma.supportTicket.create({
      data: {
        ...data,
        status: 'open',
      },
    });
  }

  /**
   * Assign ticket
   */
  static async assignTicket(ticketId: string, agentId: string) {
    return prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        assignedTo: agentId,
        status: 'in_progress',
      },
    });
  }

  /**
   * Update ticket status
   */
  static async updateStatus(ticketId: string, status: string) {
    return prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status,
        resolvedAt: status === 'resolved' ? new Date() : null,
      },
    });
  }
}
```

```typescript
// src/lib/support/chat.ts
export class ChatService {
  /**
   * Create chat session
   */
  static async createSession(customerId: string, tenantId: string) {
    return prisma.chatSession.create({
      data: {
        customerId,
        tenantId,
        status: 'active',
      },
    });
  }

  /**
   * Send message
   */
  static async sendMessage(data: {
    sessionId: string;
    senderId: string;
    senderType: 'customer' | 'agent';
    message: string;
  }) {
    return prisma.chatMessage.create({
      data: {
        ...data,
        sentAt: new Date(),
      },
    });
  }
}
```

```typescript
// src/lib/support/sla.ts
export class SLAService {
  /**
   * Create SLA policy
   */
  static async createPolicy(data: {
    name: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    responseTime: number; // hours
    resolutionTime: number; // hours
    tenantId: string;
  }) {
    return prisma.slaPolicy.create({
      data,
    });
  }

  /**
   * Check SLA compliance
   */
  static async checkCompliance(ticketId: string) {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) throw new Error('Ticket not found');

    const policy = await prisma.slaPolicy.findFirst({
      where: {
        tenantId: ticket.tenantId,
        priority: ticket.priority,
      },
    });

    if (!policy) return { compliant: true };

    const responseTime = ticket.assignedAt
      ? (ticket.assignedAt.getTime() - ticket.createdAt.getTime()) / (1000 * 60 * 60)
      : 0;

    return {
      compliant: responseTime <= policy.responseTime,
      responseTime,
      slaTime: policy.responseTime,
    };
  }
}
```

```typescript
// src/lib/support/escalation.ts
export class EscalationService {
  /**
   * Escalate ticket
   */
  static async escalateTicket(ticketId: string, reason: string, escalateToId: string) {
    return prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        assignedTo: escalateToId,
        priority: 'urgent',
        escalationHistory: {
          create: {
            reason,
            escalatedTo: escalateToId,
            escalatedAt: new Date(),
          },
        },
      },
    });
  }
}
```

---

## Implementation Checklist

### ERP
- [x] Inventory Management
- [x] Warehouse Management
- [x] Procurement
- [x] Manufacturing
- [x] Logistics

### CRM
- [x] Lead Management
- [x] Deal Management
- [x] Follow-up Management

### HRMS
- [x] Attendance Management
- [x] Payroll Management
- [x] Recruitment
- [x] Leave Management
- [x] Performance Appraisal

### Finance
- [x] Accounting
- [x] Invoices
- [x] Billing
- [x] Tax
- [x] Treasury

### Marketplace
- [x] Vendors
- [x] Merchants
- [x] Products
- [x] Orders
- [x] Commissions

### CMS
- [x] Website Pages
- [x] Blogs
- [x] SEO

### Support
- [x] Tickets
- [x] Chat
- [x] SLA
- [x] Escalation

---

## Integration Notes

All modules share:
- Multi-tenant architecture
- Role-based access control
- Audit logging
- Activity tracking
- Notification integration
- Workflow integration
