// EXAMPLE PROGRAMS:

var __helloVLDBExample__ =
    'var builder = PortalsJS.ApplicationBuilder("helloVLDB")\n' +
    'var _ = builder.workflows\n' +
    '  .source(builder.generators.fromArray(["Hello VLDB!"]).stream)\n' +
    '  .logger()\n' +
    `  .sink()\n` +
    '  .freeze()\n' +
    'var helloVLDB = builder.build()\n' +
    'var system = PortalsJS.System()\n' +
    'system.launch(helloVLDB)\n' +
    'system.stepUntilComplete()\n'

var __rangFilterExample__ =
    'var builder = PortalsJS.ApplicationBuilder("rangeFilter")\n' +
    'var _ = builder.workflows\n' +
    '  .source(builder.generators.fromRange(0, 1024, 8).stream)\n' +
    '  .filter(x => x % 2 == 0)\n' +
    '  .logger()\n' +
    `  .sink()\n` +
    '  .freeze()\n' +
    'var rangeFilter = builder.build()\n' +
    'var system = PortalsJS.System()\n' +
    'system.launch(rangeFilter)\n' +
    'system.stepUntilComplete()\n'

var __mapExample__ =
    'var builder = PortalsJS.ApplicationBuilder("map")\n' +
    'var _ = builder.workflows\n' +
    '  .source(builder.generators.fromRange(0, 128, 8).stream)\n' +
    '  .map(ctx => x => [x, x.toString().length])\n' +
    '  .logger()\n' +
    `  .sink()\n` +
    '  .freeze()\n' +
    'var map = builder.build()\n' +
    'var system = PortalsJS.System()\n' +
    'system.launch(map)\n' +
    'system.stepUntilComplete()\n'

var __simpleRecursiveExample__ =
    'var builder = PortalsJS.ApplicationBuilder("simpleRecursive")\n' +
    'var gen = builder.generators.fromArray([10])\n' +
    'var seq = builder.sequencers.random()\n' +
    'var recursiveWorkflow = builder.workflows\n' +
    '  .source(seq.stream)\n' +
    '  .processor(ctx => x => {\n' +
    '    if (x > 0) {\n' +
    '      ctx.emit(x - 1)\n' +
    '    }\n' +
    '  })\n' +
    '  .logger()\n' +
    `  .sink()\n` +
    '  .freeze()\n' +
    'var _ = builder.connections.connect(gen.stream, seq)\n' +
    'var _ = builder.connections.connect(recursiveWorkflow.stream, seq)\n' +
    'var simpleRecursive = builder.build()\n' +
    'var system = PortalsJS.System()\n' +
    'system.launch(simpleRecursive)\n' +
    'system.stepUntilComplete()\n'

var __sleepingBeautyExample__ =
    'function sleep(milliseconds) {\n' +
    '  const start = Date.now();\n' +
    '  while (Date.now() - start < milliseconds) {}\n' +
    '}\n' +
    'let builder = PortalsJS.ApplicationBuilder("sleepingBeauty")\n' +
    'let _ = builder.workflows\n' +
    '  .source(builder.generators.fromRange(0, 1024, 2).stream)\n' +
    '  .map(ctx => x => {\n' +
    '       sleep(500);\n' +
    '       return x;\n' +
    '  })\n' +
    '  .logger()\n' +
    `  .sink()\n` +
    '  .freeze()\n' +
    'let sleepingBeauty = builder.build()\n' +
    'let system = PortalsJS.System()\n' +
    'system.launch(sleepingBeauty)\n' +
    'system.stepUntilComplete()\n'

var __billionEvents__ =
    'var builder = PortalsJS.ApplicationBuilder("billionEvents")\n' +
    'var _ = builder.workflows\n' +
    '  .source(builder.generators.fromRange(0, 1024*1024*1024, 1024*1024).stream)\n' +
    '  .filter(x => x % (1024*1024) == 0)\n' +
    '  .logger()\n' +
    `  .sink()\n` +
    '  .freeze()\n' +
    'var billionEvents = builder.build()\n' +
    'var system = PortalsJS.System()\n' +
    'system.launch(billionEvents)\n' +
    'system.stepUntilComplete()\n'

var __multiDataflowExample__ =
    'let builder = PortalsJS.ApplicationBuilder("multiDataflow")\n' +
    `\n` +
    'let sequencer = builder.sequencers.random()\n' +
    `\n` +
    'let workflow1 = builder.workflows\n' +
    '  .source(sequencer.stream)\n' +
    '  .flatMap(ctx => x => { if (x <= 0) { return []; } else { return [x - 1]; } })\n' +
    '  .logger("workflow1: ")\n' +
    `  .sink()\n` +
    '  .freeze()\n' +
    'let generator = builder.generators.signal(8)\n' +
    'builder.connections.connect(generator.stream, sequencer)\n' +
    'builder.connections.connect(workflow1.stream, sequencer)\n' +
    `\n` +
    'let workflow2 = builder.workflows\n' +
    '  .source(workflow1.stream)\n' +
    '  .map(ctx => x => { return x * x; })\n' +
    '  .logger("workflow2: ")\n' +
    `  .sink()\n` +
    '  .freeze()\n' +
    `\n` +
    'let workflow3 = builder.workflows\n' +
    '  .source(workflow1.stream)\n' +
    '  .map(ctx => x => { return x * x * x; })\n' +
    '  .logger("workflow3: ")\n' +
    `  .sink()\n` +
    '  .freeze()\n' +
    `\n` +
    'let multiDataflow = builder.build()\n' +
    'let system = PortalsJS.System()\n' +
    'system.launch(multiDataflow)\n' +
    'system.stepUntilComplete()\n'

var __pingPongExample__ =
    'var builder = PortalsJS.ApplicationBuilder("pingPong")\n' +
    'var portal = builder.portal.portal("pingPongPortal")\n' +
    'var generator = builder.generators.signal(8)\n' +
    `\n` +
    'function pingerPonger(ctx, x) {\n' +
    '  if (x > 0) {\n' +
    '    ctx.log.info(x);\n' +
    '    var future = ctx.ask(portal, x - 1);\n' +
    '    ctx.await(future, ctx => {\n' +
    '      var v = future.value(ctx);\n' +
    '      ctx.reply(pingerPonger(ctx, v));\n' +
    '    });\n' +
    '  }\n' +
    '  else {\n' +
    '    ctx.reply(x);\n' +
    '  }\n' +
    '}\n' +
    `\n` +
    'var pingPongWorkflow = builder.workflows\n' +
    '  .source(generator.stream)\n' +
    '  .askerreplier(\n' +
    '    portal,\n' +
    '    portal,\n' +
    '    ctx => x => {\n' +
    '      var future = ctx.ask(portal, x);\n' +
    '      ctx.await(future, ctx => {\n' +
    '        ctx.log.info("Done!");\n' +
    '      });\n' +
    '    },\n' +
    '    ctx => x => {\n' +
    '      pingerPonger(ctx, x)\n' +
    '    },\n' +
    '  )\n' +
    '  .logger()\n' +
    `  .sink()\n` +
    '  .freeze()\n' +
    `\n` +
    'var pingPong = builder.build()\n' +
    'var system = PortalsJS.System()\n' +
    'system.launch(pingPong)\n' +
    'system.stepUntilComplete()\n'

var __portalAggregationExample__ =

    'let builder = PortalsJS.ApplicationBuilder("portalAggregation")\n' +
    `\n` +
    'let portal = builder.portal.portal("portal", x => { return 0; })\n' +
    `\n` +
    'let generator = builder.generators.fromRange(0, 128, 8)\n' +
    `\n` +
    'let aggregationWorkflow = builder.workflows\n' +
    '  .source(generator.stream)\n' +
    '  .key(x => { return 0; })\n' +
    '  .replier(\n' +
    '    portal,\n' +
    '    ctx => x => {\n' +
    '      // aggregate state from generator input\n' +
    '      let state = PortalsJS.PerKeyState("state", 0, ctx);\n' +
    '      state.set(x + state.get());\n' +
    '      ctx.emit(state.get());\n' +
    '    },\n' +
    '    ctx => x => {\n' +
    '      // reply to portal requests with the aggregated state\n' +
    '      let state = PortalsJS.PerKeyState("state", 0, ctx);\n' +
    '      ctx.reply(state.get());\n' +
    '    },\n' +
    '  )\n' +
    '  .sink()\n' +
    '  .freeze()\n' +
    `\n` +
    `let trigger = builder.generators.fromArrayOfArrays([[0], [0], [0], [0], [0], [0], [0], [0], [0]])\n` +
    `\n` +
    'let requestingWorkflow = builder.workflows\n' +
    '  .source(trigger.stream)\n' +
    '  .asker(\n' +
    '    portal,\n' +
    '    ctx => x => {\n' +
    '      // query the portal for the aggregated state\n' +
    '      let future = ctx.ask(portal, x);\n' +
    '      ctx.await(future, ctx => {\n' +
    '        ctx.emit(future.value(ctx));\n' +
    '      });\n' +
    '    },\n' +
    '  )\n' +
    '  .logger("requestingWorkflow: ")\n' +
    `  .sink()\n` +
    '  .freeze()\n' +
    `\n` +
    'let portalAggregation = builder.build()\n' +
    'let system = PortalsJS.System()\n' +
    'system.launch(portalAggregation)\n' +
    'system.stepUntilComplete()\n'

var __portalServiceExample__ =
    'let builder = PortalsJS.ApplicationBuilder("portalService")\n' +
    `\n` +
    'let portal = builder.portal.portal("portal", x => { return 0; })\n' +
    'let generator = builder.generators.empty()\n' +
    'let replierWorkflow = builder.workflows\n' +
    '  .source(generator.stream)\n' +
    '  .replier(\n' +
    '    portal,\n' +
    '    ctx => x => { },\n' +
    '    ctx => x => {\n' +
    '      let state = PortalsJS.PerKeyState("prev", 0, ctx);\n' +
    '      let prev = state.get();\n' +
    '      ctx.reply(prev);\n' +
    '      state.set(x);\n' +
    '    },\n' +
    '  )\n' +
    '  .sink()\n' +
    '  .freeze()\n' +
    `\n` +
    'let trigger = builder.generators.fromRange(0, 128, 8)\n' +
    'let requesterWorkflow = builder.workflows\n' +
    '  .source(trigger.stream)\n' +
    '  .asker(\n' +
    '    portal,\n' +
    '    ctx => x => {\n' +
    '      let future = ctx.ask(portal, x);\n' +
    '      ctx.await(future, ctx => {\n' +
    '        ctx.emit(future.value(ctx));\n' +
    '      });\n' +
    '    },\n' +
    '  )\n' +
    '  .logger("requesterWorkflow: ")\n' +
    `  .sink()\n` +
    '  .freeze()\n' +
    `\n` +
    'let portalService = builder.build()\n' +
    'let system = PortalsJS.System()\n' +
    'system.launch(portalService)\n' +
    'system.stepUntilComplete()\n'


var __registryExample__ =
    'let builder1 = PortalsJS.ApplicationBuilder("app1")\n' +
    'let generator1 = builder1.generators.fromRange(0, 16, 1)\n' +
    'let workflow1 = builder1.workflowsWithName("workflow1")\n' +
    '  .source(generator1.stream)\n' +
    '  .map(ctx => x => x * x)\n' +
    '  .sink()\n' +
    '  .freeze()\n' +
    'let app1 = builder1.build()\n' +
    `\n` +
    'let builder2 = PortalsJS.ApplicationBuilder("app2")\n' +
    'let app1Stream = builder2.registry.streams.get("/app1/workflows/workflow1/stream")\n' +
    'let workflow2 = builder2.workflows\n' +
    '  .source(app1Stream)\n' +
    '  .map(ctx => x => x * x)\n' +
    '  .logger()\n' +
    '  .sink()\n' +
    '  .freeze()\n' +
    'let app2 = builder2.build()\n' +
    `\n` +
    'let system = PortalsJS.System()\n' +
    'system.launch(app1)\n' +
    'system.launch(app2)\n' +
    'system.stepUntilComplete()\n'

// SWAPPING EXAMPLE PROGRAMS:

function helloVLDBExample() {
    jsEditor.setValue(__helloVLDBExample__);
}

function rangeFilterExample() {
    jsEditor.setValue(__rangFilterExample__);
}

function mapExample() {
    jsEditor.setValue(__mapExample__);
}

function simpleRecursiveExample() {
    jsEditor.setValue(__simpleRecursiveExample__);
}

function sleepingBeautyExample() {
    jsEditor.setValue(__sleepingBeautyExample__);
}

function billionEventsExample() {
    jsEditor.setValue(__billionEvents__);
}

function multiDataflowExample() {
    jsEditor.setValue(__multiDataflowExample__);
}

function pingPongExample() {
    jsEditor.setValue(__pingPongExample__);
}

function portalAggregationExample() {
    jsEditor.setValue(__portalAggregationExample__);
}

function portalServiceExample() {
    jsEditor.setValue(__portalServiceExample__);
}

function registryExample() {
    jsEditor.setValue(__registryExample__);
}
