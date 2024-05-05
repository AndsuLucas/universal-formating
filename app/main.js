import { useFormaterInput } from "./components/csv_input.js";
import { useEventBus } from "./events/event_bus.js";
import { useMarkdownOutput } from "./components/markdown_output.js";

const { eventBus } = useEventBus();
const { template, init } = useFormaterInput(eventBus);
const { template: template2, init: init2 } = useMarkdownOutput(eventBus);

document.querySelector('#app').innerHTML = `
    ${template}
    ${template2}
`

// TODO: REFACTOR
init();
init2()