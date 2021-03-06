module.exports = {
    QUESTION: {
        TYPES: ['YES_NO', 'FILL_IN_BLANK', 'MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'GROUPED'],
        VALIDATION: ['NONE', 'ALPHANUMERIC', 'NUMERIC', 'ALPHABETIC']
    },
    FORM: {
        LAYOUTS: ['TWO_COLUMNS', 'THREE_COLUMNS'],
        TYPES: ['SCREENING', 'LOAN_APPLICATION', 'GROUP_APPLICATION', 'ACAT', 'LOAN_PRODUCT', 'LOAN_PROPOSAL'],
        SIGNATURES: {
          LOAN: ['Filled By', 'Checked By'],
          SCREENING: ['Applicant', 'Filled By', 'Checked By']
        },
        ACAT_STRUCTURE: [{
            name: 'Inputs And Activity Costs',
            sub_sections: [{
                name: 'Input',
                sub_sections: [{
                    name: 'Seed'
                },{
                    name: 'Fertilizers'
                },{
                    name: 'Chemicals'
                }]
            },{
                name: 'Labour Cost'
            },{
                name: 'Other Costs'
            }]
        },{
            name: 'Revenue'
        }]
    },
    MODULES: ['MFI_SETUP','USER_MANAGEMENT']
}