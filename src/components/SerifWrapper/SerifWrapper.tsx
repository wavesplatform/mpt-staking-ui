import * as React from 'react';
import { Box, BoxProps } from '@waves.exchange/wx-react-uikit';

export type SerifWrapperProps = BoxProps & {
	variant?: 'primary' | 'error' | 'default' | 'warning';
    disabled?: boolean;
}

const variants = {
    default: '#C6D8E2',
    error: 'error',
    primary: '#0983F3',
    warning: 'warning',
};

export const SerifWrapper: React.FC<SerifWrapperProps> = ({
    variant = 'default',
    disabled,
    children,
    ...props
}) => {
    const { sx, ...rest } = props;

    return (
        <Box
            position="relative"
            borderRight="1px solid"
            borderLeft="1px solid"
            borderColor={(disabled || !variants[variant]) ? variants.default : variants[variant]}
            sx={{
                '&::before': {
                    content: '""',
                    display: 'block',
                    width: '10px',
                    height: '100%',
                    position: 'absolute',
                    top: '-2px',
                    left: '0',
                    borderTop: '2px solid',
                    borderBottom: '2px solid',
                    borderColor: (disabled || !variants[variant]) ? variants.default : variants[variant]
                },
                '&::after': {
                    content: '""',
                    display: 'block',
                    width: '10px',
                    height: '100%',
                    position: 'absolute',
                    top: '-2px',
                    right: '0',
                    borderTop: '2px solid',
                    borderBottom: '2px solid',
                    borderColor: (disabled || !variants[variant]) ? variants.default : variants[variant]
                },
                ...(sx ? props.sx as object : null)
            }}
            {...rest as any}
        >
            {children}
        </Box>
    );
};

SerifWrapper.displayName = 'SerifWrapper';

