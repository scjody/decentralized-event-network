/**
 * Provides data related to users
 * @author mtownsend
 * @since April 2020
 * @flow
 */

import React from 'react';
import { useData } from './ApiProvider';
import FourOhFour from '../view/FourOhFour';

import type { ApiData } from './ApiProvider';

export type ProfileData = {
  name: string,
  displayName: string
};

type ActivityData = {|
  activities: Array<ApiActivity>
|};

// TODO: Find a way to share these models between the app and api codebase
export type ApiUser = {|
  name: string,
  url: string
|};

export type ApiActivity = {|
  url: string,
  type: string,
  user: ApiUser,
  published: string,
  object: ApiObject
|};

export type ApiEvent = {|
  type: 'Event',
  name: string,
  host: ApiUser,
  start: string,
  end: string
|};

export type ApiObject = ApiEvent;

type HOC<C: React$ComponentType<*>> = (C) => React$ComponentType<React$ElementConfig<C>>

type ActivityProvider = () => ApiData<ActivityData>;
export const useInbox = () => useData<ActivityData>('user/inbox');
export const useOutbox = (username?:string) => useData<ActivityData>(username ? `user/${username}/outbox`: 'user/outbox');
export const useFeed = () => useData<ActivityData>('user/feed');


export const withActivities = <C: React$ComponentType<*>>(provider:ActivityProvider):HOC<C> => (Component:C) => 
  (props:React$ElementConfig<C>) => {
    const data = provider();
    if (data === 'LOADING') {
      return <div>LOADING...</div>
    }
    if (typeof data === 'number') {
      return <div>{`ERROR ${data}`}</div>
    }
    return <Component {...props} activities={data.activities} />;
  };

export const withProfile = <C: React$ComponentType<*>>(username:?string):HOC<C> => (Component:C) => 
  (props:React$ElementConfig<C>) => {
    if (!username) {
      return <FourOhFour />
    }
    const data:ApiData<ProfileData> = useData(`user/${username}`);
    if (data === 'LOADING') {
      return <div>LOADING...</div>;
    }
    if (data === 404) {
      return <FourOhFour />
    }
    if (typeof data === 'number') {
      // TODO: Fancy error page
      return <div>{`ERROR ${data}`}</div>;
    }

    return <Component {...props} profile={data}/>;
  };
