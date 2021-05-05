import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const useQuery = ({ url = null, method = null, body = null }) => {
  const history = useHistory();
  const [apiOptions, setApiOptions] = useState({
    url,
    method,
    body,
  });
  const [apiData, setApiData] = useState({ data: null, status: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApi = async () => {
      const options = getOptions(apiOptions.method, apiOptions.body);

      const response = await fetch(apiOptions.url, options);
      if (response.status >= 401) {
        return void history.replace(history.location.pathname, {
          errorStatusCode: response.status,
        });
      }

      const data = await response.json();
      if (Object.keys(data).length === 0) {
        setApiData({ data: null, status: response.status });
      } else {
        setApiData({ data: data, status: response.status });
      }
    };

    if (apiOptions.url !== null) {
      setLoading(true);
      fetchApi().finally(() => {
        setLoading(false);
      });
    }
  }, [apiOptions]);

  return {
    loading,
    data: apiData.data,
    status: apiData.status,
    setApiOptions,
  };
};

function getOptions(method, body) {
  const options = {
    method: method,
    credentials: "include",
    body: method !== "GET" ? JSON.stringify(body) : undefined,
  };

  if (body instanceof FormData) {
    options.body = body;
  } else {
    options.headers = {
      "Content-Type": "application/json",
    };
  }

  return options;
}

export default useQuery;
