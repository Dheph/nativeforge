import { z } from 'zod';

export const registryItemTypeSchema = z.enum([
  'component',
  'template',
  'hook',
  'service',
]);

export const registryItemFileSchema = z.object({
  path: z.string(),
  content: z.string(),
});

export const registryItemSchema = z.object({
  name: z.string(),
  type: registryItemTypeSchema,
  dependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema),
});

export const registryIndexSchema = z.array(
  z.object({
    name: z.string(),
    type: registryItemTypeSchema,
    dependencies: z.array(z.string()).optional(),
    registryDependencies: z.array(z.string()).optional(),
  })
);

export type RegistryItem = z.infer<typeof registryItemSchema>;
export type RegistryIndex = z.infer<typeof registryIndexSchema>;
