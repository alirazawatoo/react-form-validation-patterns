import { schema } from './formSchema';
import fixture from '../fixtures/formData';
it.each([Infinity, -Infinity, NaN])('rejects nonfinite rates %s', async (rate) => {
  const data = JSON.parse(JSON.stringify(fixture));
  data.groups[0].tasks[0].rate = rate;
  await expect(schema.validate(data)).rejects.toThrow();
});
it('rejects finite inputs whose line total overflows', async () => {
  const data = JSON.parse(JSON.stringify(fixture));
  data.groups[0].tasks[0].quantity = 1e308;
  data.groups[0].tasks[0].rate = 1e308;
  await expect(schema.validate(data)).rejects.toThrow('Quantity times rate is too large');
});
