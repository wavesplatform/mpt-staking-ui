import { FC, useContext } from 'react';
import { Box, Flex } from '@waves.exchange/wx-react-uikit';
import { observer } from 'mobx-react-lite';
import { FormattedInput, InputErrors, Text } from 'uikit';
import logo from '*.svg';
import { StakeForm } from '../../forms/StakeForm.tsx';
import { AppStoreContext } from '../../../../App.tsx';
import { UnstakeForm } from '../../forms/UnstakeForm.tsx';

export const Dashboard: FC = observer(() => {
    const rs = useContext(AppStoreContext);
    return (
        <Box>
            {
                !rs.balanceStore.otherBalance.data.isLoading &&
                <>
                    <StakeForm />
                    <UnstakeForm />
                </>
            }
        </Box>
    );
});

Dashboard.displayName = 'Dashboard';
