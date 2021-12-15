import { useEffect, useState } from 'react';
import axios from 'axios';
import { RadioGroup } from '@headlessui/react';
import { SearchInput } from '../SearchInput';
import { useAccountVerificationForm } from './AccountVerificationForm';
import { StepLogo } from './StepLogo';
import { StepHeading } from './StepHeading';

export function AccountVerificationFormStep2() {
  const { goForward, updateAccountVerificationFormState } = useAccountVerificationForm();
  const [searchValue, setSearchValue] = useState('');
  const { data, error, loading } = useInstitutionsData();

  // When a user selects a bank, update the form state and push the user to the next step
  function onChange(selectedInstitution) {
    updateAccountVerificationFormState({ selectedInstitution });
    goForward();
  }

  // The list of institutions is loading
  if (loading) {
    return <p>Loading institutions</p>;
  }

  // Something went wrong while fetching rhe lost of institutions
  if (error) {
    return <p>Something went wrong</p>;
  }

  // The list of institutions loaded, but no data was returned from the server
  if (!data || data.length === 0) {
    return <p>No institutions found</p>;
  }

  // TODO should this be sorted alphabetically ? Or just use the order that comes back from the basiq API?
  const filteredInstitutions = data.filter(item => {
    // Filter out any institutions which are currently not operational
    // TODO confirm this logic is correct
    if (item.stage !== 'live' || item.status !== 'operational') return false;
    // If the user is searching, filter out any institutions which do not match the search term
    if (!searchValue) return true;
    return (
      item.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
      item.shortName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
    );
  });

  return (
    <div className="flex flex-col flex-grow space-y-6 sm:space-y-8">
      {/* STEP LOGO */}
      {/* To help the user keep context of what product they're using, */}
      {/* and what bank they're about to connect to. */}
      <StepLogo src="/logo-on-white.svg" alt="Piper logo" />

      {/* STEP CONTENT */}
      <div className="flex flex-col flex-grow space-y-6 sm:space-y-8">
        {/* STEP HEADING */}
        {/* A short as possible heading to help the user quickly recognise the task at hand. */}
        <StepHeading>Find your bank</StepHeading>

        {/* INSTITUTIONS */}
        <div className="space-y-3">
          <SearchInput
            labelScreenReader="Search"
            placeholder="Search"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
          <form>
            {filteredInstitutions.length ? (
              // TODO: Fix keyboard navigation when switching between radio options
              <RadioGroup onChange={onChange}>
                <RadioGroup.Label className="sr-only">Select bank</RadioGroup.Label>
                <div className="space-y-3">
                  {filteredInstitutions.map(institution => (
                    <RadioGroup.Option
                      key={institution.id}
                      value={institution}
                      className="relative rounded-lg p-3 cursor-pointer flex border hover:bg-primary-50 hover:border-primary-500 active:bg-primary-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-30 ring-offset-1 ring-offset-transparent outline-none transition-colors"
                    >
                      <div className="flex items-center w-full space-x-3">
                        {/* Institution logo */}
                        <img
                          className="w-12 h-12 rounded overflow-hidden"
                          src={institution.logo.links.square}
                          alt={`Logo of ${institution.name}`}
                        />

                        {/* Institution shortName */}
                        <RadioGroup.Label as="p">{institution.name}</RadioGroup.Label>

                        {/* Chevron icon */}
                        <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            className="stroke-current text-gray-500"
                            d="M7.5 4.167 13.333 10 7.5 15.833"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            ) : (
              <span>No results found</span>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function useInstitutionsData() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();

  // TODO check if this should a call directly to the Basiq API server
  useEffect(() => {
    axios
      .get('/api/institutions')
      .then(res => setData(res.data.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
