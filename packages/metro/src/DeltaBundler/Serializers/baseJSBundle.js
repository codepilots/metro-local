/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 * @oncall react_native
 */

'use strict';

import type {
  MixedOutput,
  Module,
  ReadOnlyGraph,
  SerializerOptions,
} from '../types.flow';
import type {Bundle} from 'metro-runtime/src/modules/types.flow';

const getAppendScripts = require('../../lib/getAppendScripts');
const processModules = require('./helpers/processModules');

function prefixWithBaseUrl(baseUrl, url) {
  if (!baseUrl) return url;
  return baseUrl.replace(/\/$/, '') + '/' + url.replace(/^\//, '');
}

function baseJSBundle(
  entryPoint: string,
  preModules: $ReadOnlyArray<Module<>>,
  graph: ReadOnlyGraph<>,
  options: SerializerOptions,
): Bundle {
  for (const module of graph.dependencies.values()) {
    options.createModuleId(module.path);
  }

  const processModulesOptions = {
    filter: options.processModuleFilter,
    createModuleId: options.createModuleId,
    dev: options.dev,
    includeAsyncPaths: options.includeAsyncPaths,
    projectRoot: options.projectRoot,
    serverRoot: options.serverRoot,
    sourceUrl: options.sourceUrl,
  };

  // Do not prepend polyfills or the require runtime when only modules are requested
  if (options.modulesOnly) {
    preModules = [];
  }

  const preCode = processModules(preModules, processModulesOptions)
    .map(([_, code]) => code)
    .join('\n');

  const modules = [...graph.dependencies.values()].sort(
    (a: Module<MixedOutput>, b: Module<MixedOutput>) =>
      options.createModuleId(a.path) - options.createModuleId(b.path),
  );

  // Example usage for sourceMapUrl:
  if (options.baseUrl && options.sourceMapUrl) {
    options.sourceMapUrl = prefixWithBaseUrl(options.baseUrl, options.sourceMapUrl);
  }

  const postCode = processModules(
    getAppendScripts(entryPoint, [...preModules, ...modules], {
      asyncRequireModulePath: options.asyncRequireModulePath,
      createModuleId: options.createModuleId,
      getRunModuleStatement: options.getRunModuleStatement,
      inlineSourceMap: options.inlineSourceMap,
      runBeforeMainModule: options.runBeforeMainModule,
      runModule: options.runModule,
      shouldAddToIgnoreList: options.shouldAddToIgnoreList,
      sourceMapUrl: options.sourceMapUrl,
      sourceUrl: options.sourceUrl,
      getSourceUrl: options.getSourceUrl,
    }),
    processModulesOptions,
  )
    .map(([_, code]) => code)
    .join('\n');

  return {
    pre: preCode,
    post: postCode,
    modules: processModules(
      [...graph.dependencies.values()],
      processModulesOptions,
    ).map(([module, code]) => [options.createModuleId(module.path), code]),
  };
}

module.exports = baseJSBundle;
