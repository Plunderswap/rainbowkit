import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useAccount, useBalance, useEnsAvatar, useEnsName } from 'wagmi';
import { isMobile } from '../../utils/isMobile';
import { Avatar } from '../Avatar/Avatar';
import { Box } from '../Box/Box';
import { CloseButton } from '../CloseButton/CloseButton';
import { abbreviateETHBalance } from '../ConnectButton/abbreviateETHBalance';
import { formatAddress } from '../ConnectButton/formatAddress';
import { formatENS } from '../ConnectButton/formatENS';
import { CopiedIcon } from '../Icons/Copied';
import { CopyIcon } from '../Icons/Copy';
import { DisconnectIcon } from '../Icons/Disconnect';
import { ShowRecentTransactionsContext } from '../RainbowKitProvider/ShowRecentTransactionsContext';
import { Text } from '../Text/Text';
import { TxList } from '../Txs/TxList';
import { ProfileDetailsAction } from './ProfileDetailsAction';
import { toBech32Address } from "@zilliqa-js/crypto";

interface ProfileDetailsProps {
  address: ReturnType<typeof useAccount>['address'];
  balanceData: ReturnType<typeof useBalance>['data'];
  ensAvatar: ReturnType<typeof useEnsAvatar>['data'];
  ensName: ReturnType<typeof useEnsName>['data'];
  onClose: () => void;
  onDisconnect: () => void;
}

export function ProfileDetails({
  address,
  balanceData,
  ensAvatar,
  ensName,
  onClose,
  onDisconnect,
}: ProfileDetailsProps) {
  const showRecentTransactions = useContext(ShowRecentTransactionsContext);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAddress2, setCopiedAddress2] = useState(false);
  let Zil1Address = "";
  
    const copyAddressAction = useCallback(() => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopiedAddress(true);
    }
  }, [address]);

  useEffect(() => {
    if (copiedAddress) {
      const timer = setTimeout(() => {
        setCopiedAddress(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [copiedAddress]);

  const copyAddressAction2 = useCallback(() => {
    if (Zil1Address) {
      navigator.clipboard.writeText(Zil1Address);
      setCopiedAddress2(true);
    }
  }, [Zil1Address]);

  useEffect(() => {
    if (copiedAddress2) {
      const timer = setTimeout(() => {
        setCopiedAddress2(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [copiedAddress2]);

  if (!address) {
    return null;
  }

  const accountName = ensName ? formatENS(ensName) : address;

  if (address !== undefined) {
    Zil1Address = toBech32Address(address);
  }
  const ethBalance = balanceData?.formatted;
  const displayBalance = ethBalance
    ? abbreviateETHBalance(parseFloat(ethBalance))
    : undefined;
  const titleId = 'rk_profile_title';
  const titleId2 = 'rk_profile_title2';
  const mobile = isMobile();

  return (
    <>
      <Box display="flex" flexDirection="column">
        <Box background="profileForeground" padding="16">
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            gap={mobile ? '16' : '12'}
            justifyContent="center"
            margin="8"
            style={{ textAlign: 'center' }}
          >
            <Box
              style={{
                position: 'absolute',
                right: 16,
                top: 16,
                willChange: 'transform',
              }}
            >
              <CloseButton onClose={onClose} />
            </Box>{' '}
            <Box marginTop={mobile ? '24' : '0'}>
              <Avatar
                address={address}
                imageUrl={ensAvatar}
                size={mobile ? 82 : 74}
              />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              gap={mobile ? '4' : '0'}
              textAlign="center"
            >
              <Box textAlign="center" gap="4">
              <Text
                  as="h1"
                  color="modalText"
                  id={titleId}
                  size={mobile ? '16' : '14'}
                  weight="heavy"
                >
                    Your Address
                  </Text>
                  <Text
                    as="h1"
                    color="modalTextSecondary"
                    id={titleId}
                    size={mobile ? '16' : '14'}
                    weight="semibold"
                  >
                  {accountName}
                </Text>
              </Box>
              <Box textAlign="center" gap="4" paddingTop="16">
              <Text
                  as="h1"
                  color="modalText"
                  id={titleId2}
                  size={mobile ? '16' : '14'}
                  weight="heavy"
                >
                    Your Zil1 Address
                  </Text>
                  <Text
                    as="h1"
                    color="modalTextSecondary"
                    id={titleId}
                    size={mobile ? '16' : '14'}
                    weight="semibold"
                  >
                  {Zil1Address}
                </Text>
              </Box>
              {balanceData && (
                <Box textAlign="center" gap="4" paddingTop="16">
                                <Text
                  as="h1"
                  color="modalText"
                  id={titleId2}
                  size={mobile ? '16' : '14'}
                  weight="heavy"
                >
                    Balance
                  </Text>
                  <Text
                    as="h1"
                    color="modalTextSecondary"
                    id={titleId}
                    size={mobile ? '16' : '14'}
                    weight="semibold"
                  >
                    {displayBalance} {balanceData.symbol}
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            gap="8"
            margin="2"
            marginTop="16"
          >
            <ProfileDetailsAction
              action={copyAddressAction}
              icon={copiedAddress ? <CopiedIcon /> : <CopyIcon />}
              label={copiedAddress ? 'Copied 0x!' : 'Copy 0x'}
            />
            <ProfileDetailsAction
              action={copyAddressAction2}
              icon={copiedAddress2 ? <CopiedIcon /> : <CopyIcon />}
              label={copiedAddress2 ? 'Copied Zil1!' : 'Copy Zil1'}
            />
            <ProfileDetailsAction
              action={onDisconnect}
              icon={<DisconnectIcon />}
              label="Disconnect"
              testId="disconnect-button"
            />
          </Box>
        </Box>
        {showRecentTransactions && (
          <>
            <Box background="generalBorder" height="1" marginTop="-1" />
            <Box>
              <TxList address={address} />
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
