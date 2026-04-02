type AppErrorContext = {
  scope: string;
  error: unknown;
};

type UserMessageOptions = {
  fallback: string;
  signedOut?: string;
  network?: string;
  rateLimited?: string;
};

const asMessage = (error: unknown) => (error instanceof Error ? error.message.toLowerCase() : '');

const isSignedOutLikeError = (error: unknown) => {
  const message = asMessage(error);
  return message.includes('signed in') || message.includes('auth/') || message.includes('permission');
};

const isNetworkLikeError = (error: unknown) => {
  const message = asMessage(error);
  return message.includes('network') || message.includes('fetch') || message.includes('offline');
};

const isRateLimitLikeError = (error: unknown) => {
  const message = asMessage(error);
  return message.includes('429') || message.includes('too many');
};

export const reportAppError = ({ scope, error }: AppErrorContext) => {
  console.error(`[${scope}]`, error);
};

export const getUserFacingErrorMessage = (
  error: unknown,
  { fallback, signedOut, network, rateLimited }: UserMessageOptions
) => {
  if (signedOut && isSignedOutLikeError(error)) {
    return signedOut;
  }

  if (rateLimited && isRateLimitLikeError(error)) {
    return rateLimited;
  }

  if (network && isNetworkLikeError(error)) {
    return network;
  }

  return fallback;
};
