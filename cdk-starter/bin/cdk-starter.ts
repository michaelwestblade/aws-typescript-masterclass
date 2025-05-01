#!/opt/homebrew/opt/node/bin/node
import * as cdk from 'aws-cdk-lib';
import { PhotoStacks } from '../lib/PhotoStacks';

const app = new cdk.App();
new PhotoStacks(app, 'PhotoStacks');
