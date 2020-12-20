/* eslint-disable import/prefer-default-export */

import { useState, useEffect } from 'react';
import { useToken } from './token';
import Requester from '../requests';

export function useRequester() {
  const [requester] = useState(new Requester());
  const [token, setToken] = useToken();

  useEffect(() => {
    requester.setTokenFromHook(token, setToken);
  }, [requester, token, setToken]);

  return requester;
}
