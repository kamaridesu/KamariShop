export const getUserState = async () => {
  return abstractFetch("api/users/userstate", "GET");
};

export const abstractFetch = async (url, method, inputs) => {
  const options = {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputs),
  };

  if (method === "GET") {
    delete options.body;
  }

  return await (await fetch(`/${url}`, options)).json();
};
