#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { main } from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

main();
