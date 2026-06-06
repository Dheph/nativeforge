import { ofetch } from 'ofetch';
import { z } from 'zod';

const REGISTRY_URL =
  process.env.NATIVEFORGE_REGISTRY_URL ||
  'https://raw.githubusercontent.com/Dheph/nativeforge/main/packages/registry/dist';

export const registryItemFileSchema = z.object({
  path: z.string(),
  content: z.string(),
});

export const registryItemSchema = z.object({
  name: z.string(),
  type: z.enum(['component', 'template', 'hook', 'service']),
  dependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema),
});

export const registryIndexSchema = z.array(
  z.object({
    name: z.string(),
    type: z.enum(['component', 'template', 'hook', 'service']),
    dependencies: z.array(z.string()).optional(),
    registryDependencies: z.array(z.string()).optional(),
  })
);

export type RegistryItem = z.infer<typeof registryItemSchema>;
export type RegistryIndex = z.infer<typeof registryIndexSchema>;

export async function getRegistryIndex(): Promise<RegistryIndex> {
  try {
    const data = await ofetch(`${REGISTRY_URL}/index.json`);
    return registryIndexSchema.parse(data);
  } catch (error) {
    throw new Error('Failed to fetch registry index.');
  }
}

export async function getRegistryComponent(name: string): Promise<RegistryItem> {
  try {
    const data = await ofetch(`${REGISTRY_URL}/components/${name}.json`);
    return registryItemSchema.parse(data);
  } catch (error) {
    throw new Error(`Failed to fetch component ${name} from registry.`);
  }
}
