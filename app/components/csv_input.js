export const useFormaterInput = (eventBus) => {
  const template = `
<div class="input-container">
  <button class="input-button">Convert!</button>
  <label for="input">Add:</label>
  <textarea name="input" id="input">
  </textarea>
</div>
  `;

  const init = () => {
    //document.querySelector('textarea').value = document.querySelector('textarea').value.trim().replace(/\s+/g, '\n')
    document.querySelector('button')
      .addEventListener('click', () => {
        const input = document.querySelector('textarea')
          .value;
        eventBus.notify('input', input);
      });
  }

  return {
    template,
    init
  }
}