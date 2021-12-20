import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '../Button';

export function AccountVerificationFormLearnMoreModal({ isOpen, onClose, onConfirm }) {
  const connectButtonRef = useRef(null);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose} initialFocus={connectButtonRef}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>
          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-sm p-6 my-4 overflow-hidden align-middle transition-all transform bg-white shadow-xl rounded-lg space-y-6">
              <Dialog.Title as="h3" className="text-2xl font-semibold tracking-tight leading-tight text-center">
                Security you <br />
                can trust
              </Dialog.Title>

              {/* Illustration to communicate secure bank connection using Basiq */}
              <div className="space-y-2">
                {/* Dashed line - top */}
                <div className="px-8">
                  <div className="h-4 rounded-t-lg border-t border-l border-r border-dashed border-neutral-dim"></div>
                </div>
                <div className="flex justify-between">
                  {/* Product logo - square */}
                  <img className="w-16 h-16" src="/product-logo-square.svg" alt="Piper logo" />
                  {/* Security icon (shield-check) + Basiq logo */}
                  <div className="flex flex-col justify-center items-center space-y-1 -m-2">
                    <svg
                      className="w-12 h-12 flex-no-shrink"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                    >
                      <path
                        className="fill-current text-secondary-bold-darker"
                        d="m41.236 11.969.968-.251a1 1 0 0 0-1.019-.748l.05.998ZM24 5.889l.667-.746a1 1 0 0 0-1.334 0l.667.745Zm-17.236 6.08.05-1a1 1 0 0 0-1.018.749l.968.25ZM24 41.243l-.25.968a1 1 0 0 0 .5 0l-.25-.968ZM41.185 10.97c-.392.02-.787.03-1.185.03v2c.431 0 .86-.011 1.286-.033l-.1-1.997ZM40 11a22.91 22.91 0 0 1-15.333-5.857l-1.334 1.49A24.911 24.911 0 0 0 40 13v-2ZM23.333 5.143A22.91 22.91 0 0 1 8 11v2a24.91 24.91 0 0 0 16.667-6.365l-1.334-1.49ZM8 11c-.398 0-.793-.01-1.185-.03l-.101 1.998c.426.022.855.032 1.286.032v-2Zm-2.204.719A25.043 25.043 0 0 0 5 18h2c0-1.998.255-3.935.732-5.781l-1.936-.501ZM5 18c0 11.65 7.968 21.437 18.75 24.212l.5-1.937C14.328 37.722 7 28.715 7 18H5Zm19.25 24.212C35.031 39.437 43 29.65 43 18h-2c0 10.715-7.329 19.722-17.25 22.275l.5 1.937ZM43 18c0-2.168-.276-4.274-.796-6.282l-1.936.501c.477 1.846.732 3.783.732 5.78h2Z"
                      />
                      <path
                        className="stroke-current text-secondary-bold-darker"
                        d="m18 24 4 4 8-8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <img className="w-16 h-4" src="/basiq-logo.svg" alt="Basiq logo" />
                  </div>
                  {/* Bank illustration */}
                  <img className="w-16 h-16" src="/bank-illustration.svg" alt="Bank illustration" />
                </div>
                {/* Dashed line - bottom */}
                <div className="px-8">
                  <div className="h-4 rounded-b-lg border-b border-l border-r border-dashed border-neutral-dim"></div>
                </div>
              </div>

              {/* Secure argument 1 - Detail */}
              <div className="space-y-2 text-left">
                <h4 className="text-md font-semibold leading-snug">Bank grade 256-bit SSL encryption</h4>
                <p className="text-sm text-neutral-muted-darker leading-relaxed">
                  Powered by leading open banking platform {/* TODO: remove auto-focus on link when opening modal */}
                  <a
                    target="_blank"
                    href="https://basiq.io"
                    rel="noopener noreferrer"
                    className="text-primary-bold-darker underline rounded hover:text-opacity-90 active:text-opacity-75 focus:ring-2 focus:ring-primary-bold focus:ring-opacity-30 ring-offset-1 ring-offset-transparent outline-none"
                  >
                    basiq.io
                  </a>
                  , we use AES 256-bit encryption, trusted by all major banks, to keep your data private and secure. We
                  undergo regular penetration testing and privacy compliance audits.
                </p>
              </div>

              {/* Secure argument 2 - Detail */}
              <div className="space-y-2 text-left">
                <h4 className="text-md font-semibold leading-snug">
                  We never save your bank login credentials in the app
                </h4>
                <p className="text-sm text-neutral-muted-darker leading-relaxed">
                  Credentials are stored using an AES 256-bit encryption envelope, which means they can never be made
                  accessible to anyone.
                </p>
              </div>

              {/* Secure argument 3 - Detail */}
              <div className="space-y-2 text-left">
                <h4 className="text-md font-semibold leading-snug">We can not transact on your behalf</h4>
                <p className="text-sm text-neutral-muted-darker leading-relaxed">
                  You only give Piper permission to verify the details of the account to deduct the nominated regular
                  fee from.
                </p>
              </div>

              {/* Secure argument 4 - Detail */}
              <div className="space-y-2 text-left">
                <h4 className="text-md font-semibold leading-snug">We don’t sell your data</h4>
                <p className="text-sm text-neutral-muted-darker leading-relaxed">
                  We don’t sell your personal data, nor do we share it unless you ask us to. All your data is 100%
                  stored securely.
                </p>
              </div>

              <div className="space-y-2">
                <Button ref={connectButtonRef} onClick={onConfirm} variant="bold" block>
                  Securely connect my account
                </Button>
                <Button onClick={onClose} variant="subtle" block>
                  Not right now
                </Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
