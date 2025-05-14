import { all } from "axios";

export default {
    // Language switcher
    language: "Language",
    english: "English",
    arabic: "Arabic",

    //small components
    seeAll: "See All",

    //Error messages
    propertyNotFound: "Property not found",

    //Home
    properties: "Properties",
    findYourProperty: "Find your property in your preferred city",
    topLocalities: "Top Localities To Buy Properties",

    // Settings page
    loading: "Loading...",
    accountSettings: "Account Settings",
    personalInformation: "Personal Information",
    updatePersonalDetails: "Update your personal details",
    security: "Security",
    passwordAuth: "Password and authentication",
    withdrawMethods: "Withdraw Methods",
    manageWithdrawOptions: "Manage your withdraw options",
    appSettings: "App Settings",
    fingerPrint: "Fingerprint",
    faceId: "Face ID",
    biometricAuth: "Biometric Authentication",
    UnlockAppWithYour: "Unlock app with Your",
    use: "Use",
    toLogIn: "to log in",
    support: "Support",
    helpCenter: "Help Center",
    getHelp: "Get help with the app",
    aboutUs: "About Us",
    learnMore: "Learn more about our company",
    termsConditions: "Terms & Conditions",
    readTerms: "Read our terms and conditions",
    privacyPolicy: "Privacy Policy",
    readPrivacy: "Read our privacy policy",
    logout: "Log out",
    login: "Log in",

    //Profile
    goodMorning: "Good Morning!",
    idVerification: "Complete your ID verification",
    totalBalance: "Total Balance",
    myWallet: "My Wallet",
    pendingIncome: "Pending Income",
    outcome: "Outcome",
    investmentOverview: "Investment Overview",
    activeInvestment: "Active Investment",
    pendingInvestment: "Pending Investment",
    egBalance: "Total Balance",
    pendingRentalIncome: "Pending Rental Income",
    yourShare: "Your Share",
    noUserData: "No user data available",

    // Verification
    verification: {
        title: "ID Verification",
        status: "Verification Status",
        statuses: {
            pending: "Pending",
            verified: "Verified",
            rejected: "Rejected"
        },
        statusMessages: {
            pending: "Your verification is currently being processed.",
            verified: "Your ID has been verified successfully.",
            rejected: "Your verification was rejected. Please resubmit your documents."
        },
        whyTitle: "Why do we need verification?",
        whyText: "To ensure security and comply with regulations, we need to verify your identity before you can invest or withdraw funds.",
        uploadTitle: "Upload Your Documents",
        nationalId: "National ID Number",
        nationalIdPlaceholder: "Enter your National ID number",
        frontId: "Front of ID",
        backId: "Back of ID",
        selfie: "Selfie with ID",
        takePhoto: "Take Photo",
        submit: "Submit for Verification",
        notesTitle: "Important Notes",
        note1: "Make sure your ID is valid and not expired",
        note2: "All information should be clearly visible",
        note3: "For selfie, hold your ID next to your face",
        resubmit: "Resubmit Documents",
        alerts: {
            missingInfo: "Missing Information",
            missingInfoText: "Please provide your National ID number and all required photos.",
            invalidId: "Invalid National ID",
            invalidIdText: "Please enter a valid national ID number.",
            success: "Success",
            successText: "Your documents have been submitted successfully. We'll review them shortly.",
            error: "Submission Failed",
            errorText: "Failed to submit verification documents. Please try again.",
            cameraPermission: "Permission Required",
            cameraPermissionText: "You need to allow access to your camera to take photos."
        }
    },

    // propertyDetails
    rooms: "Rooms",
    floors: "Floors",
    priceHistory: "Price History",
    shareDetails: "Share Details",
    sharePrice: "Share Price",
    totalShares: "Total Shares",
    availableShares: "Available Shares",
    noPreviousPriceHistory: "No previous price history",
    ofThisPropertyIsSoldOut: "of this property is sold",

    //shares
    shares: "Shares",
    yourShares: "Your Shares",
    noSharesFound: "No shares found",
    percentageOwned: "Percentage Owned",
    shareValue: "Shares Value",
    monthlyRent: "Monthly Rent",
    pricePerShare: "Price Per Share",

    //explore
    allProperties: "All Properties",
    featuredProperties: "Featured Properties",

    //support pages
        // Common
        needHelp: "Still need help?",
        contactSupportDesc: "If you can't find what you're looking for, reach out to our support team.",
        contactSupport: "Contact Support",
        
        // About Us
        aboutPropShare: "About PropShare",
        aboutPropShareDesc: "PropShare is a fintech startup committed to democratizing real estate investment. We help people invest in high-value properties through fractional ownership.",
        ourMission: "Our Mission",
        missionStatement: "To make real estate investment accessible, affordable, and profitable for everyone — especially young and low-income individuals.",
        whyChooseUs: "Why Choose Us?",
        whyChooseUsPoints: "• Minimal capital requirement\n• Transparent investments\n• Real-time portfolio tracking\n• Rental income returns",

        // Help Center FAQs
        faq: "Frequently Asked Questions",
        faq1: {
            question: "How do I invest in a property?",
            answer: "Simply browse the properties, select one that fits your goals, and buy fractional shares using your wallet balance."
        },
        faq2: {
            question: "What is fractional ownership?",
            answer: "Fractional ownership allows you to invest in a portion of a high-value property, earning returns proportionally."
        },
        faq3: {
            question: "Can I sell my shares?",
            answer: "Yes, you can resell your shares anytime via the in-app secondary market for liquidity."
        },
        faq4: {
            question: "How do I receive rental income?",
            answer: "Rental profits are distributed automatically to your PropShare wallet on a monthly basis."
        },

        // Privacy Policy
        privacyIntro: "At PropShare, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your information.",
        privacy1: {
            title: "1. Information Collection",
            body: "We collect personal details such as name, email, phone, and investment activity. This data is used solely for account management and investment operations."
        },
        privacy2: {
            title: "2. Data Security",
            body: "Your data is encrypted and stored securely. We implement best practices to ensure confidentiality, integrity, and availability."
        },
        privacy3: {
            title: "3. Sharing Information",
            body: "We never share your personal information with third parties without your consent unless required by law."
        },

        // Terms & Conditions
        termsIntro: "Welcome to PropShare. By using our app, you agree to the following terms.",
        terms1: {
            title: "1. Account Responsibility",
            body: "You are responsible for safeguarding your account credentials and ensuring all activity under your account complies with our terms."
        },
        terms2: {
            title: "2. Investment Risks",
            body: "Investments in real estate carry risk. Past performance is not indicative of future results."
        },
        terms3: {
            title: "3. Platform Usage",
            body: "You must not use the platform for illegal activities, spamming, or attempting to breach security measures."
        },

    //Wallet
    walletBalance: "Wallet Balance",
    mainBalance: "Main Balance",
    deposit: "Deposit",
    withdraw: "Withdraw",
    recentTransactions: "Recent Transactions",
    topUpWallet: "Top Up Wallet",
    proceedToPayment: "Proceed to Payment",
    enterAmountInEGP: "Enter amount in EGP",
    transactions: {
        receive: "Receive",
        deposit: "Deposit",
        withdraw: "Withdraw"
    },
    currency: {
        code: "EGP"
    },


  buyShares: "Buy Shares",
  sharesToBuy: "Number of shares",
  totalCost: "Total Cost",
  yourBalance: "Your Balance",
  confirmPurchase: "Confirm Purchase",
  invalidShareNumber: "Please enter a valid number",
  notEnoughShares: "Not enough shares available",
  insufficientBalance: "Insufficient balance",
  purchaseSuccess: "Purchase successful!",
  purchaseError: "Purchase failed. Try again",
  loginToBuy: "Log in to purchase shares",
  processing: "Processing..."

};