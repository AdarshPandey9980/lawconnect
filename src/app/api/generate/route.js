// app/api/generate/route.js
import { NextResponse } from 'next/server';

const TEMPLATES = {
  'SERVICE_AGREEMENT': `SERVICE AGREEMENT

This Service Agreement (the "Agreement") is made between:

[SERVICE_PROVIDER_NAME] ("Provider")
and
[CLIENT_NAME] ("Client")

1. Services
   Provider agrees to provide the following services: [SERVICES]

2. Compensation
   Client agrees to pay [AMOUNT] for the services according to the following schedule: [PAYMENT_TERMS]

3. Term
   This Agreement shall commence on [START_DATE] and continue until [END_DATE]

4. Termination
   Either party may terminate this Agreement with [NOTICE_PERIOD] written notice.`,

  'EMPLOYMENT_AGREEMENT': `EMPLOYMENT AGREEMENT

This Employment Agreement (the "Agreement") is made between:

[EMPLOYER_NAME] ("Employer")
and
[EMPLOYEE_NAME] ("Employee")

1. Position
   Employee is hired for the position of [POSITION] starting [START_DATE]

2. Compensation
   Base salary: [AMOUNT]
   Benefits: [BENEFITS]

3. Working Hours
   Standard working hours shall be [HOURS] per week

4. Duties and Responsibilities
   [DETAILED_RESPONSIBILITIES]`,

  'RENTAL_AGREEMENT': `RENTAL AGREEMENT

This Rental Agreement is made on [DATE] between:

[LANDLORD_NAME] ("Landlord")
and
[TENANT_NAME] ("Tenant")

1. Property
   Address: [PROPERTY_ADDRESS]

2. Term
   Lease Period: [START_DATE] to [END_DATE]
   Monthly Rent: [AMOUNT]
   Security Deposit: [DEPOSIT_AMOUNT]

3. Utilities
   The following utilities are included/not included: [UTILITIES_LIST]

4. Maintenance
   [MAINTENANCE_TERMS]`,

  'POWER_OF_ATTORNEY': `POWER OF ATTORNEY

I, [PRINCIPAL_NAME], residing at [ADDRESS], hereby appoint [ATTORNEY_NAME] as my Attorney-in-Fact ("Agent").

POWERS GRANTED:
1. Real Estate Transactions
2. Banking Transactions
3. Business Operations
4. Tax Matters

This Power of Attorney shall become effective immediately and shall remain in effect until [END_DATE] or until revoked.`,

  'LAST_WILL': `LAST WILL AND TESTAMENT

I, [FULL_NAME], residing at [ADDRESS], declare this to be my Last Will and Testament.

1. Revocation
   I hereby revoke all prior wills and codicils.

2. Marital Status
   I am married to [SPOUSE_NAME].

3. Children
   My children are: [CHILDREN_NAMES]

4. Distribution of Property
   [DISTRIBUTION_DETAILS]

5. Executor
   I appoint [EXECUTOR_NAME] as executor of my will.`,

  'PRIVACY_POLICY': `PRIVACY POLICY

Last Updated: [DATE]

1. Information We Collect
   [COMPANY_NAME] ("we," "our," or "us") collects the following types of information:
   - Personal Information
   - Usage Data
   - Cookies

2. How We Use Your Information
   We use the collected information for:
   - Providing our services
   - Improving user experience
   - Communication

3. Information Sharing
   We do not sell your personal information to third parties.

4. Security Measures
   We implement appropriate security measures to protect your information.

5. Your Rights
   You have the right to:
   - Access your data
   - Request corrections
   - Request deletion`
};

export async function POST(request) {
  try {
    const { docType, inputs } = await request.json();

    if (!TEMPLATES[docType]) {
      return NextResponse.json(
        { error: 'Invalid document type' },
        { status: 400 }
      );
    }

    let document = TEMPLATES[docType];

    // Replace all placeholders with input values
    Object.entries(inputs).forEach(([key, value]) => {
      document = document.replace(
        new RegExp(`\\[${key}\\]`, 'g'),
        value || `[${key}]`
      );
    });

    return NextResponse.json({ document });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate document' },
      { status: 500 }
    );
  }
}