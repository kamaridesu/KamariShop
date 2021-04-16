import { useState, useEffect } from "react";
import { useHistory } from "react-router";

const useQuery = ({ url = null, method = null, body = null }) => {
  const history = useHistory();
  const [apiOptions, setApiOptions] = useState({
    url,
    method,
    body,
  });
  const [apiData, setApiData] = useState();
  const [loading, setLoading] = useState(true);

  const fetchApi = () => {
    const options = {
      method: apiOptions.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiOptions.body),
    };

    if (apiOptions.method === "GET") {
      delete options.body;
    }

    if (apiOptions.body instanceof FormData) {
      options.body = apiOptions.body;
      delete options.headers;
    }

    fetch(apiOptions.url, options)
      .then((data) => {
        if (data.status > 401) {
          history.replace(history.location.pathname, {
            errorStatusCode: data.status,
          });
        }
        return data.json();
      })
      .then((data) => {
        setApiData(() => (Object.keys(data).length === 0 ? null : data));
        setLoading(false);
      });
  };

  useEffect(() => {
    if (apiOptions.url !== null) {
      fetchApi();
    }
  }, [apiOptions]);
  console.log(apiData, loading, apiOptions);
  return [apiData, loading, setApiOptions];
};

export default useQuery;
