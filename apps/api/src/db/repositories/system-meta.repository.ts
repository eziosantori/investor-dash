export type SystemMetaRecord = {
  key: string;
  value: string;
};

export interface SystemMetaStore {
  findByKey(key: string): Promise<SystemMetaRecord | null>;
  upsert(record: SystemMetaRecord): Promise<void>;
}

export interface SystemMetaRepository {
  getValue(key: string): Promise<string | null>;
  setValue(key: string, value: string): Promise<void>;
}

export function createSystemMetaRepository(store: SystemMetaStore): SystemMetaRepository {
  return {
    async getValue(key) {
      const record = await store.findByKey(key);
      return record?.value ?? null;
    },
    async setValue(key, value) {
      await store.upsert({ key, value });
    },
  };
}
