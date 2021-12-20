import { useEffect, useState } from 'react';
import { useFormState } from 'react-use-form-state';
import axios from 'axios';
import ms from 'ms';
import { Button } from '../Button';
import { TextField } from '../TextField';
import { VerificationProgress } from '../VerificationProgress';
import { useAccountVerificationForm } from './AccountVerificationForm';
import { StepLogo } from './StepLogo';
import { StepHeading } from './StepHeading';
import { StepDescription } from './StepDescription';

export function AccountVerificationFormStep3InstitutionLogin() {
  const [jobId, setJobId] = useState();

  function onSubmit({ jobId }) {
    setJobId(jobId);
  }

  if (!jobId) {
    return <AccountVerificationFormStep3InstitutionLoginForm onSubmit={onSubmit} />;
  }
  return <AccountVerificationFormStep3InstitutionLoginProgress jobId={jobId} />;
}

function AccountVerificationFormStep3InstitutionLoginForm({ onSubmit }) {
  const token = useGetTokenData();
  const { goBack, accountVerificationFormState } = useAccountVerificationForm();
  const [formState, { text, password }] = useFormState();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const { selectedInstitution } = accountVerificationFormState;
  if (!selectedInstitution) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const jobId = await createConnection({
        token,
        userId: accountVerificationFormState.user.id,
      });
      onSubmit({ jobId });
      setSubmitting(false);
    } catch (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col flex-grow space-y-6 sm:space-y-8">
      {/* STEP LOGO */}
      {/* To help the user keep context of what product they're using, */}
      {/* and what bank they're about to connect to. */}
      <StepLogo src={selectedInstitution.logo.links.square} alt={`Logo of ${selectedInstitution.name}`} />

      {/* STEP CONTENT */}
      <div className="flex flex-col flex-grow justify-center space-y-6 sm:space-y-8">
        <div className="space-y-3">
          {/* STEP HEADING */}
          {/* A short as possible heading to help the user quickly recognise the task at hand. */}
          <StepHeading>{selectedInstitution.shortName}</StepHeading>

          {/* STEP DESCRIPTION */}
          <StepDescription>
            Safely connect to {selectedInstitution.name} using your {selectedInstitution.serviceName} credentials.
          </StepDescription>
        </div>

        {/* CREDENTIALS FORM */}
        {/* TODO: Write more */}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6 sm:space-y-8">
              {/* TODO: 
              The best way to approach this is to look for attributes with the "Caption" suffix to know what to render
              Pass these additional login parameters as optional arguments when you create any connection. 
              
              Can we map over all the attributes ending in Caption for a neater solution? */}
              {/* Login ID */}
              <TextField
                {...text('loginId')}
                id="loginId"
                label={selectedInstitution.loginIdCaption}
                placeholder={selectedInstitution.loginIdCaption}
                required
              />

              {/* securityCodeCaption (if exists, St George Bank e.g.) */}
              {selectedInstitution.securityCodeCaption && (
                <TextField
                  {...password('securityCode')}
                  id="securityCode"
                  label={selectedInstitution.securityCodeCaption}
                  placeholder={selectedInstitution.securityCodeCaption}
                  required
                />
              )}

              {/* Password */}
              <div className="space-y-2">
                <TextField
                  {...password('password')}
                  id="password"
                  label={selectedInstitution.passwordCaption}
                  placeholder={selectedInstitution.passwordCaption}
                  required
                />

                {/* Forgotten password */}
                <a
                  href={selectedInstitution.forgottenPasswordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs text-primary-600 underline rounded hover:text-opacity-90 active:text-opacity-75 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-30 ring-offset-1 ring-offset-transparent outline-none"
                >
                  Forgot password?
                </a>
              </div>
              {/* Actions */}
              <div className="space-y-2">
                <Button type="submit" loading={submitting} variant="bold" block>
                  Connect
                </Button>
                <Button type="button" variant="subtle" block onClick={goBack}>
                  Pick another bank
                </Button>
              </div>
              {/** Error state */}
              {errorMessage && (
                <div className="bg-red-100 text-red-500 p-5">
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function AccountVerificationFormStep3InstitutionLoginProgress({ token, jobId }) {
  const token = useGetTokenData();
  const { goForward, accountVerificationFormState } = useAccountVerificationForm();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState();

  const { selectedInstitution } = accountVerificationFormState;

  // The estimated time job is expected time to take (in milliseconds)
  // We only care about the "verifyCredentials" and "retrieveAccounts" step
  const estimatedTime =
    selectedInstitution.stats.averageDurationMs.verifyCredentials +
    selectedInstitution.stats.averageDurationMs.retrieveAccounts;

  // Poll the job
  useEffect(() => {
    if (!token) return;
    const timer = setTimeout(async () => {
      try {
        setProgress(0);
        const response = await checkConnectionStatus({ token, jobId });

        // We only care about the "verify-credentials" and "retrieve-accounts" steps
        // So once these steps have been completed, we can move to the user to the next step
        const steps = response.data.steps.filter(
          ({ title }) => title === 'verify-credentials' || title === 'retrieve-accounts'
        );

        const progress = 0;
        for (const step of steps) {
          switch (step.status) {
            case 'in_progress':
              progress += 25;
            case 'success':
              progress += 50;
              break;
          }
        }

        setProgress(progress);
      } catch (error) {
        setError(error);
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [jobId, token]);

  return (
    <div className="flex flex-col flex-grow space-y-6 sm:space-y-8">
      <StepLogo src={selectedInstitution.logo.links.square} alt={`Logo of ${selectedInstitution.name}`} />
      <div className="flex flex-col flex-grow justify-center space-y-6 sm:space-y-8 items-center text-center">
        <VerificationProgress value={progress} error={error} />
        {error ? (
          <div className="space-y-2">
            <h3 className="font-bold text-xl">Error</h3>
            <p>{error.message}</p>
          </div>
        ) : progress !== 100 ? (
          <div className="space-y-2">
            <h3 className="font-bold text-xl">Verifying credentials...</h3>
            <p>Usually takes takes {ms(estimatedTime)}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="font-bold text-2xl">Connected 🎉</h3>
            <p>One last step to go...</p>
            <Button block onClick={goForward}>
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

async function checkConnectionStatus({ token, jobId }) {
  const response = await axios.get(`https://au-api.basiq.io/jobs/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
}

async function createConnection({ token, userId }) {
  const jobId = await getJobId({ token, userId });
  return jobId;
}

async function getJobId({ token, userId }) {
  // TODO these should come from the form, but used for testing atm
  var data = JSON.stringify({
    loginId: 'gavinBelson',
    password: 'hooli2016',
    institution: {
      id: 'AU00000',
    },
  });
  const response = await axios.post(`https://au-api.basiq.io/users/${userId}/connections`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response.data.id;
}

// TODO need to think about this properly
function useGetTokenData() {
  const [token, setToken] = useState();

  useEffect(() => {
    axios.get('/api/client-token').then(response => setToken(response.data));
  }, []);

  return token;
}
