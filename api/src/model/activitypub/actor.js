/**
 * Models an ActivityPub Actor object
 * @author mtownsend
 * @since April 2020
 * @flow
 */

import Mongoose from '../../service/db.js';
import { Object$Schema, Object$Document } from './object.js';

const Actor$Schema = new Object$Schema({
  preferredUsername: String,
  inbox: String,
  outbox: String,
  followers: String,
  following: String,
  publicKey: {
    id: String,
    owner: String,
    publicKeyPem: String
  }
});

class Actor$Document extends Object$Document {
  preferredUsername: string;
  inbox: string;
  outbox: string;
  followers: string;
  following: string;
  publicKey: {
    id: string,
    owner: string,
    publicKeyPem: string
  };
}

Actor$Schema.pre('save', function() {
  this['@context'].push('https://w3id.org/security/v1');
});

Actor$Schema.loadClass(Actor$Document);

const Actor:Class<Actor$Document> = Mongoose.model('Actor', Actor$Schema);

export default Actor;
