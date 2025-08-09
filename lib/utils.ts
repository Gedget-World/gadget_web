import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Makes a GET request to the specified URL and returns the JSON response.
 * @param {string} url - The endpoint to fetch data from.
 * @returns {Promise<any>} - The JSON response from the API.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function getApiCall(url: string): Promise<any> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "GET request failed");
  }

  return data;
}

/**
 * Makes a POST request to the specified URL with the provided body and returns the JSON response.
 * @param {string} url - The endpoint to post data to.
 * @param {any} body - The data to send in the request body.
 * @returns {Promise<any>} - The JSON response from the API.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function postApiCall(url: string, body: any): Promise<any> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "POST request failed");
  }

  return data;
}

/**
 * Makes a PUT request to the specified URL with the provided body and returns the JSON response.
 * @param {string} url - The endpoint to update data at.
 * @param {any} body - The data to send in the request body.
 * @returns {Promise<any>} - The JSON response from the API.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function putApiCall(url: string, body: any): Promise<any> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "PUT request failed");
  }

  return data;
}

/**
 * Makes a DELETE request to the specified URL and returns the JSON response.
 * @param {string} url - The endpoint to delete data from.
 * @returns {Promise<any>} - The JSON response from the API.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function deleteApiCall(url: string): Promise<any> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "DELETE request failed");
  }

  return data;
}

/**
 * Example API calls
const user = await getApiCall('/users/123');

const newUser = await postApiCall('/users', {
  name: 'Krishna',
  email: 'krishna@example.com',
});

await putApiCall('/users/123', {
  name: 'Krishna Kant',
});

await deleteApiCall('/users/123');

 */
