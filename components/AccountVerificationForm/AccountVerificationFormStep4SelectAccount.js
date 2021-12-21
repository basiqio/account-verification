import { useEffect, useState } from 'react';
import axios from 'axios';
import { RadioGroup } from '@headlessui/react';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../Button';
import { useAccountVerificationForm } from './AccountVerificationFormProvider';
import { StepLogo } from './StepLogo';
import { StepHeading } from './StepHeading';
import { StepDescription } from './StepDescription';

export function AccountVerificationFormStep4SelectAccount() {
  const { goForward, accountVerificationFormState, updateAccountVerificationFormState } = useAccountVerificationForm();
  const { selectedInstitution } = accountVerificationFormState;

  const [selectedAccount, setSelectedAccount] = useState();

  const { data, error, loading } = useAccountsData({
    userId: accountVerificationFormState.user.id,
    institutionId: selectedInstitution?.id,
  });

  function handleSubmit(e) {
    e.preventDefault();
    updateAccountVerificationFormState({ selectedAccount });
    goForward();
  }

  if (!selectedInstitution) return null;

  return (
    <div className="flex flex-col flex-grow space-y-6 sm:space-y-8">
      {/* STEP LOGO */}
      {/* To help the user keep context of what product they're using, */}
      {/* and what bank they're about to connect to. */}
      <StepLogo src={selectedInstitution.logo.links.square} alt={`Logo of ${selectedInstitution.name}`} />

      {/* STEP CONTENT */}
      <div className="flex flex-col flex-grow justify-center space-y-6 sm:space-y-8">
        {/* STEP HEADING */}
        {/* A short as possible heading to help the user quickly recognise the task at hand. */}
        <StepHeading>
          Select your daily <br />
          spending account
        </StepHeading>

        {/* STEP DESCRIPTION */}
        <StepDescription>
          Please select an account that allows direct debits. Many banks only allow withdrawals from transaction
          accounts.
        </StepDescription>

        {error ? (
          <span>Error</span>
        ) : loading ? (
          // TODO: Skeleton
          <span>Loading</span>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {data.length ? (
              <RadioGroup value={selectedAccount} onChange={setSelectedAccount}>
                <RadioGroup.Label className="sr-only">Select account</RadioGroup.Label>
                <div className="space-y-3">
                  {data.map((acc, idx) => {
                    // Disabled if status is not `available` or class type is not `transaction`
                    const disabled = acc.status !== 'available' || acc.class.type !== 'transaction';
                    return (
                      <RadioGroup.Option
                        key={idx}
                        value={acc}
                        disabled={disabled}
                        className={`rounded-lg outline-none ${
                          !disabled &&
                          'focus:border-primary-bold focus:ring-2 focus:ring-primary-bold focus:ring-opacity-30 ring-offset-1 ring-offset-transparent'
                        }`}
                      >
                        {({ checked }) => (
                          <div
                            className={`relative rounded-lg p-3 flex  ${
                              disabled
                                ? 'bg-neutral-subtle-darker cursor-not-allowed opacity-50'
                                : 'bg-white cursor-pointer border border-neutral-dim hover:bg-primary-subtle hover:border-primary-bold active:bg-primary-subtle-darker transition-colors'
                            } ${checked && 'bg-primary-subtle border-primary-bold'}`}
                          >
                            <div className="flex flex-grow space-x-3">
                              {disabled ? (
                                // Lock icon
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                  />
                                </svg>
                              ) : (
                                // Radio circle
                                <span
                                  className={`flex items-center justify-center w-6 h-6 rounded-full bg-white border-2  ${
                                    checked ? 'border-primary-bold' : 'border-neutral-dim-darker'
                                  }`}
                                >
                                  {checked && <span className={`w-2 h-2 rounded-full bg-primary-bold`} />}
                                </span>
                              )}

                              <div className="flex-grow space-y-2">
                                <RadioGroup.Label as="p" className="font-medium">
                                  {acc.name}
                                </RadioGroup.Label>
                                <span className="text-neutral-muted-darker text-xs">{acc.accountNo}</span>
                                <dl className="grid grid-cols-2 gap-y-0.5 text-neutral-muted-darker text-xs">
                                  <dt className="flex-1">Available:</dt>
                                  <dd className="text-right text-black font-medium">
                                    {formatCurrency(acc.availableFunds)}
                                  </dd>
                                  <dt className="flex-1">Balance:</dt>
                                  <dd className="text-right">{formatCurrency(acc.balance)}</dd>
                                </dl>
                              </div>
                            </div>
                          </div>
                        )}
                      </RadioGroup.Option>
                    );
                  })}
                </div>
              </RadioGroup>
            ) : (
              // TODO
              <span>No results found</span>
            )}
            {/* TODO: disable button if no radio selection has been made (Johan) */}
            <Button type="submit" block>
              Finish
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

// Custom react hook for managing our fetch request to retrieves a list of accounts for the current user
// The code for this API route can be found in `pages/api/accounts`
function useAccountsData({ userId, institutionId }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/accounts', { params: { userId, institutionId } })
      .then(res => setData(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId, institutionId]);

  return { data, loading, error };
}
