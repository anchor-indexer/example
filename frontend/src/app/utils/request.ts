import toast from 'react-hot-toast';

type RequestError = {
  code: number;
  message: string;
  description: string[];
  details: {
    statusCode: number;
    message: string;
    error: string;
  }[];
};

export function alertRequestError(error: Error) {
  let errorJSON: RequestError | null = null;
  try {
    errorJSON = JSON.parse(error.message);
  } catch {}
  if (errorJSON?.details) {
    toast.error(errorJSON.details[0].message);
    return;
  }
  if (errorJSON?.description) {
    toast.error(errorJSON.description.toString());
    return;
  }
  if (errorJSON?.message) {
    toast.error(errorJSON.message);
    return;
  }
  toast.error(error.message);
}
