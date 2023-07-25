export const variants = {
    primary: {
        'bg': '#FFFFFF',
        'color': '#0983F3',
        'outline': 'none',
        'boxShadow': '0px 8px 20px 0px #3C63AF2B',
        ':hover:not(:disabled)': {
            opacity: '.8',
        },
        ':active': {
            opacity: '.7',
        },
        ':disabled': {
            color: 'rgba(151, 168, 178, 1)',
            opacity: '.5',
        },
    },
    transparent: {
        'bg': 'transparent',
        'color': '#1E1E1E',
        'outline': 'none',
        ':hover:not(:disabled)': {
            backgroundColor: '#EBF5FF'
        },
        ':active:not(:disabled)': {
            backgroundColor: '#EBF5FF',
            opacity: '.7'
        },
        ':disabled': {
            color: 'rgba(151, 168, 178, 1)',
            opacity: '.5',
        },
    }
};

export const sizes = {
    default: {
        fontSize: '14px',
        lineHeight: '20px',
        height: '38px',
        paddingLeft: '24px',
        paddingRight: '24px',
    },
    large: {
        fontSize: '18px',
        lineHeight: '26px',
        height: '50px',
        paddingLeft: '22px',
        paddingRight: '22px',
    },
};
