export const useMarkdownOutput = (eventBus) => {
  const template = `
<div id="output-container" class="output-container">
    <pre id="output" class="output"></pre>
</div>
`;

  const copyButton = `<button id="copy-button">Copy</button>`

  let outputState = '';

  const breakLine = '\n';

  const spacing = ' ';

  const pipe = '|';

  const additionalSpacingLength = 2;

  const columnSeparatorMemoization = new Map();

  const contentStringMemoization = new Map();

  const toMatrix = (data) => data.split(breakLine).map((v) => v.split(';'));

  const maxSizeByColumn = (matrix) => {
    const lengthByColumn = new Map();

    for (let column = 0; column < matrix[0].length; column++) {
      for (let line = 0; line < matrix.length; line++) {
        const currentValue = matrix[line][column].trim();
        matrix[line][column] = currentValue;

        const currentLength = currentValue.length + additionalSpacingLength
        if (!lengthByColumn.has(column)) {
          lengthByColumn.set(column, currentLength);
          continue;
        }

        if (currentLength > lengthByColumn.get(column)) {
          lengthByColumn.set(column, currentLength);
        }
      }
    }
    return lengthByColumn;
  }

  const separator = (columnSize) => {
    if (columnSeparatorMemoization.has(columnSize)) {
      return columnSeparatorMemoization.get(columnSize);
    }

    const separatorString = `${pipe}${'-'.repeat(columnSize)}`;
    columnSeparatorMemoization.set(columnSize, separatorString);

    return separatorString;
  }

  const mountColumn = (columnContent, columnSize) => {
    const rightPadSize = (columnSize - columnContent.length) - spacing.length;

    if (contentStringMemoization.has(rightPadSize)) {
      const {leftAppend, rightAppend} = contentStringMemoization.get(rightPadSize);
      return leftAppend + columnContent + rightAppend;
    }

    const leftAppend = pipe + spacing;

    const rightAppend = spacing.repeat(rightPadSize);

    contentStringMemoization.set(rightPadSize, {leftAppend, rightAppend});
    return leftAppend + columnContent + rightAppend;
  }

  const formatedOutput = (matrix, columnContentSize) => {
      let titleRow = '';
      let separatorRow = '';
      let contentRows = '';

      for (let line = 0; line < matrix.length; line++) {
        for (let column = 0; column < matrix[0].length; column++) {
          const isTitleRow = line === 0;
          const columnSize = columnContentSize.get(column)
          if (isTitleRow) {
            separatorRow += separator(columnSize);
            titleRow += mountColumn(matrix[line][column], columnSize);
            continue;
          }

          contentRows += mountColumn(matrix[line][column], columnSize);
        }

        const isContentRow = contentRows.length > 0;
        if (isContentRow) {
          contentRows += `${pipe}${breakLine}`;
        }
      }

      separatorRow += pipe;
      titleRow += pipe;

      return titleRow
        + breakLine
        + separatorRow
        + breakLine
        + contentRows;
  }

  const init = () => {
    eventBus.subscribe('input', (data) => {
      data = data.trim();
      // TODO: validate data here;
      const matrix = toMatrix(data);

      const columnContentSize = maxSizeByColumn(matrix);

      outputState = formatedOutput(matrix, columnContentSize);
      document.querySelector('#output').innerHTML = outputState;
      if (!document.querySelector('#copy-button')) {
        document.querySelector('#output-container').innerHTML += copyButton;
        document.querySelector('#copy-button').addEventListener('click', () => {
          navigator.clipboard.writeText(outputState);
        });
      }
    });
  }

  return {
    template,
    init
  }
}

