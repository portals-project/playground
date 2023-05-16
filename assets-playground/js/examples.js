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
