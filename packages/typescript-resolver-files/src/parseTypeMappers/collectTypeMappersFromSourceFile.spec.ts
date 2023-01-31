import { Project } from 'ts-morph';
import { collectTypeMappersFromSourceFile } from './collectTypeMappersFromSourceFile';

describe('collectTypeMappersFromSourceFile', () => {
  it('mutates the result based on typeMappersSuffix for exports from other modules', () => {
    const project = new Project({
      compilerOptions: {
        paths: {
          '@external/module1': ['/path/to/external/modules1/index.ts'],
          '@external/module2': ['/path/to/external/modules2/index.ts'],
        },
      },
    });
    project.createSourceFile(
      `/path/to/external/modules1/index.ts`,
      `
      export interface Billing {
        id: number;
        address: string;
      }
      
      export type PaymentTypeMapper = {
        id: string;
        type: 'creditcard' | 'cash' | 'bitcoin';
        typeCode: 'payment';
      }

      export type SomethingTypeMapper = {
        id: number;
      }
      `
    );
    project.createSourceFile(
      `/path/to/external/modules2/index.ts`,
      `
      export type Address = {
        id: string;
      }
      export interface GeoTypeMapper {
        id: string;
      }
      export type NotAliasMapper2 = {
        id: number;
      }
      `
    );
    project.createSourceFile(
      '/path/to/schemas/module1/localModule1.ts',
      `
      export type Preference = {
        id: number;
      }
      export interface FlagTypeMapper {
        id: number;
      }
      export type NotAliasMapper3 = {
        id: number;
      }
      `
    );
    const mapperFile = project.createSourceFile(
      '/path/to/schemas/module1/schema.mappers.ts',
      `
      export type { 
        Billing as BillingTypeMapper, 
        PaymentTypeMapper, 
        SomethingTypeMapper as NotAliasMapper1 
      } from '@external/module1';
      export { 
        Address as AddressTypeMapper, 
        GeoTypeMapper, 
        NotAliasMapper2 
      } from '@external/module2';
      export { 
        Preference as PreferenceTypeMapper, 
        FlagTypeMapper, 
        NotAliasMapper3 
      } from './localModule1';`
    );

    const result = {};

    collectTypeMappersFromSourceFile(
      {
        typeMappersSourceFile: mapperFile,
        typeMappersSuffix: 'TypeMapper',
        resolverTypesPath: '/path/to/schemas/types.generated.ts',
      },
      result
    );

    expect(result).toEqual({
      Billing: {
        schemaType: 'Billing',
        typeMapperName: 'BillingTypeMapper',
        configImportPath: './module1/schema.mappers#BillingTypeMapper',
        typeMapperPropertyMap: {
          address: {
            kind: 'string',
            name: 'address',
            text: 'string',
          },
          id: {
            kind: 'number',
            name: 'id',
            text: 'number',
          },
        },
      },
      Payment: {
        schemaType: 'Payment',
        typeMapperName: 'PaymentTypeMapper',
        configImportPath: './module1/schema.mappers#PaymentTypeMapper',
        typeMapperPropertyMap: {
          id: {
            kind: 'string',
            name: 'id',
            text: 'string',
          },
          type: {
            kind: 'union',
            name: 'type',
            text: '"creditcard" | "cash" | "bitcoin"',
          },
          typeCode: {
            kind: 'literal',
            name: 'typeCode',
            text: '"payment"',
          },
        },
      },
      Address: {
        schemaType: 'Address',
        typeMapperName: 'AddressTypeMapper',
        configImportPath: './module1/schema.mappers#AddressTypeMapper',
        typeMapperPropertyMap: {
          id: {
            kind: 'string',
            name: 'id',
            text: 'string',
          },
        },
      },
      Geo: {
        schemaType: 'Geo',
        typeMapperName: 'GeoTypeMapper',
        configImportPath: './module1/schema.mappers#GeoTypeMapper',
        typeMapperPropertyMap: {
          id: {
            kind: 'string',
            name: 'id',
            text: 'string',
          },
        },
      },
      Preference: {
        schemaType: 'Preference',
        typeMapperName: 'PreferenceTypeMapper',
        configImportPath: './module1/schema.mappers#PreferenceTypeMapper',
        typeMapperPropertyMap: {
          id: {
            kind: 'number',
            name: 'id',
            text: 'number',
          },
        },
      },
      Flag: {
        schemaType: 'Flag',
        typeMapperName: 'FlagTypeMapper',
        configImportPath: './module1/schema.mappers#FlagTypeMapper',
        typeMapperPropertyMap: {
          id: {
            kind: 'number',
            name: 'id',
            text: 'number',
          },
        },
      },
    });
  });

  it('mutates the result based on typeMappersSuffix for imports and rexports', () => {
    const project = new Project({
      compilerOptions: {
        paths: {
          '@external/module1': ['/path/to/external/modules1/index.ts'],
          '@external/module2': ['/path/to/external/modules2/index.ts'],
        },
      },
    });
    project.createSourceFile(
      `/path/to/external/modules1/index.ts`,
      `
      export interface Billing {
        __type: 1;
      }
      
      export type PaymentTypeMapper = {
        __type: 2;
      }

      export type SomethingTypeMapper = {
        id: number;
      }
      `
    );
    project.createSourceFile(
      `/path/to/external/modules2/index.ts`,
      `
      export type Address = {
        __type: 3;
      }
      export interface GeoTypeMapper {
        __type: boolean;
      }
      export type NotAliasMapper2 = {
        id: number;
      }
      `
    );
    project.createSourceFile(
      '/path/to/schemas/module1/localModule1.ts',
      `
      export type Preference = {
        __type: true;
      }
      export interface FlagTypeMapper {
        __type: false;
      }
      export type NotAliasMapper3 = {
        id: number;
      }
      `
    );
    const mapperFile = project.createSourceFile(
      '/path/to/schemas/module1/schema.mappers.ts',
      `
      import type { 
        Billing as BillingTypeMapper, 
        PaymentTypeMapper, 
        SomethingTypeMapper as NotAliasMapper1 
      } from '@external/module1';
      import { 
        Address as AddressTypeMapper, 
        GeoTypeMapper, 
        NotAliasMapper2 
      } from '@external/module2';
      import { 
        Preference as PreferenceTypeMapper, 
        FlagTypeMapper, 
        NotAliasMapper3 
      } from './localModule1';

      export { 
        BillingTypeMapper,
        PaymentTypeMapper,
        NotAliasMapper1,
        AddressTypeMapper,
        GeoTypeMapper,
        NotAliasMapper2,
        PreferenceTypeMapper,
        FlagTypeMapper,
        NotAliasMapper3
      }
      `
    );

    const result = {};

    collectTypeMappersFromSourceFile(
      {
        typeMappersSourceFile: mapperFile,
        typeMappersSuffix: 'TypeMapper',
        resolverTypesPath: '/path/to/schemas/types.generated.ts',
      },
      result
    );

    expect(result).toEqual({
      Billing: {
        schemaType: 'Billing',
        typeMapperName: 'BillingTypeMapper',
        configImportPath: './module1/schema.mappers#BillingTypeMapper',
        typeMapperPropertyMap: {
          __type: {
            kind: 'literal',
            name: '__type',
            text: '1',
          },
        },
      },
      Payment: {
        schemaType: 'Payment',
        typeMapperName: 'PaymentTypeMapper',
        configImportPath: './module1/schema.mappers#PaymentTypeMapper',
        typeMapperPropertyMap: {
          __type: {
            kind: 'literal',
            name: '__type',
            text: '2',
          },
        },
      },
      Address: {
        schemaType: 'Address',
        typeMapperName: 'AddressTypeMapper',
        configImportPath: './module1/schema.mappers#AddressTypeMapper',
        typeMapperPropertyMap: {
          __type: {
            kind: 'literal',
            name: '__type',
            text: '3',
          },
        },
      },
      Geo: {
        schemaType: 'Geo',
        typeMapperName: 'GeoTypeMapper',
        configImportPath: './module1/schema.mappers#GeoTypeMapper',
        typeMapperPropertyMap: {
          __type: {
            kind: 'boolean',
            name: '__type',
            text: 'boolean',
          },
        },
      },
      Preference: {
        schemaType: 'Preference',
        typeMapperName: 'PreferenceTypeMapper',
        configImportPath: './module1/schema.mappers#PreferenceTypeMapper',
        typeMapperPropertyMap: {
          __type: {
            kind: 'booleanLiteral',
            name: '__type',
            text: 'true',
          },
        },
      },
      Flag: {
        schemaType: 'Flag',
        typeMapperName: 'FlagTypeMapper',
        configImportPath: './module1/schema.mappers#FlagTypeMapper',
        typeMapperPropertyMap: {
          __type: {
            kind: 'booleanLiteral',
            name: '__type',
            text: 'false',
          },
        },
      },
    });
  });

  it('mutates the result based on typeMappersSuffix for locally declared types/interfaces and exported', () => {
    const project = new Project();
    const mapperFile = project.createSourceFile(
      '/path/to/schemas/module1/schema.mappers.ts',
      `
      export interface UserTypeMapper {
        id: string;
      }

      export type ProfileTypeMapper {
        id: string;
        account: string;
      }

      export interface NotMapperInlineExport1 {
        id: string;
      }

      export type NotMapperInlineExport2 = {
        id: string;
      };

      interface Like {
        id: string;
      }
      
      type Password = {
        isValid: boolean;
      };
      type PasswordTypeMapper = Password;

      interface NotGoingToBe1TypeMapper {
        something: string;
      }

      type NotGoingToBe2TypeMapper = {
        something: string;
      }

      export { 
        Like as LikeTypeMapper,
        PasswordTypeMapper,
        NotGoingToBe1TypeMapper as NotMapper1,
        NotGoingToBe2TypeMapper as NotMapper2,
      };`
    );

    const result = {};

    collectTypeMappersFromSourceFile(
      {
        typeMappersSourceFile: mapperFile,
        typeMappersSuffix: 'TypeMapper',
        resolverTypesPath: '/path/to/schemas/types.generated.ts',
      },
      result
    );

    expect(result).toEqual({
      Profile: {
        configImportPath: './module1/schema.mappers#ProfileTypeMapper',
        schemaType: 'Profile',
        typeMapperName: 'ProfileTypeMapper',
        typeMapperPropertyMap: {
          id: {
            kind: 'string',
            name: 'id',
            text: 'string',
          },
          account: {
            kind: 'string',
            name: 'account',
            text: 'string',
          },
        },
      },
      User: {
        configImportPath: './module1/schema.mappers#UserTypeMapper',
        schemaType: 'User',
        typeMapperName: 'UserTypeMapper',
        typeMapperPropertyMap: {
          id: {
            kind: 'string',
            name: 'id',
            text: 'string',
          },
        },
      },
      Like: {
        configImportPath: './module1/schema.mappers#LikeTypeMapper',
        schemaType: 'Like',
        typeMapperName: 'LikeTypeMapper',
        typeMapperPropertyMap: {
          id: {
            kind: 'string',
            name: 'id',
            text: 'string',
          },
        },
      },
      Password: {
        configImportPath: './module1/schema.mappers#PasswordTypeMapper',
        schemaType: 'Password',
        typeMapperName: 'PasswordTypeMapper',
        typeMapperPropertyMap: {
          isValid: {
            kind: 'boolean',
            name: 'isValid',
            text: 'boolean',
          },
        },
      },
    });
  });

  it('mutates the result on multiple runs', () => {
    const project = new Project({
      compilerOptions: {
        paths: {
          '@external/module1': ['/path/to/external/modules1/index.ts'],
          '@external/module2': ['/path/to/external/modules2/index.ts'],
        },
      },
    });
    project.createSourceFile(
      `/path/to/external/modules1/index.ts`,
      `
      export interface Billing {
        id: number;
        address: string;
      }
      
      export type PaymentTypeMapper = {
        id: string;
        type: 'creditcard' | 'cash' | 'bitcoin';
        typeCode: 'payment';
      }
      `
    );
    project.createSourceFile(
      `/path/to/external/modules2/index.ts`,
      `
      export type Address = {
        id: string;
      }
      export interface GeoTypeMapper {
        id: string;
      }
      `
    );
    project.createSourceFile(
      '/path/to/schemas/preference/localModule1.ts',
      `
      export type Preference = {
        id: number;
      }
      export interface FlagTypeMapper {
        id: number;
      }
      `
    );
    const billingMapperFile = project.createSourceFile(
      '/path/to/schemas/billing/schema.mappers.ts',
      "export type {  Billing as BillingTypeMapper, PaymentTypeMapper } from '@external/module1';"
    );
    const addressMapperFile = project.createSourceFile(
      '/path/to/schemas/address/schema.mappers.ts',
      "export { Address as AddressTypeMapper, GeoTypeMapper } from '@external/module2';"
    );
    const preferenceMapperFile = project.createSourceFile(
      '/path/to/schemas/preference/schema.mappers.ts',
      "export { Preference as PreferenceTypeMapper, FlagTypeMapper } from './localModule1';"
    );

    const expectedBilling = {
      schemaType: 'Billing',
      typeMapperName: 'BillingTypeMapper',
      configImportPath: './billing/schema.mappers#BillingTypeMapper',
      typeMapperPropertyMap: {
        address: {
          kind: 'string',
          name: 'address',
          text: 'string',
        },
        id: {
          kind: 'number',
          name: 'id',
          text: 'number',
        },
      },
    };
    const expectedPayment = {
      schemaType: 'Payment',
      typeMapperName: 'PaymentTypeMapper',
      configImportPath: './billing/schema.mappers#PaymentTypeMapper',
      typeMapperPropertyMap: {
        id: {
          kind: 'string',
          name: 'id',
          text: 'string',
        },
        type: {
          kind: 'union',
          name: 'type',
          text: '"creditcard" | "cash" | "bitcoin"',
        },
        typeCode: {
          kind: 'literal',
          name: 'typeCode',
          text: '"payment"',
        },
      },
    };
    const expectedAddress = {
      schemaType: 'Address',
      typeMapperName: 'AddressTypeMapper',
      configImportPath: './address/schema.mappers#AddressTypeMapper',
      typeMapperPropertyMap: {
        id: {
          kind: 'string',
          name: 'id',
          text: 'string',
        },
      },
    };
    const expectedGeo = {
      schemaType: 'Geo',
      typeMapperName: 'GeoTypeMapper',
      configImportPath: './address/schema.mappers#GeoTypeMapper',
      typeMapperPropertyMap: {
        id: {
          kind: 'string',
          name: 'id',
          text: 'string',
        },
      },
    };
    const expectedPreference = {
      schemaType: 'Preference',
      typeMapperName: 'PreferenceTypeMapper',
      configImportPath: './preference/schema.mappers#PreferenceTypeMapper',
      typeMapperPropertyMap: {
        id: {
          kind: 'number',
          name: 'id',
          text: 'number',
        },
      },
    };
    const expectedFlag = {
      schemaType: 'Flag',
      typeMapperName: 'FlagTypeMapper',
      configImportPath: './preference/schema.mappers#FlagTypeMapper',
      typeMapperPropertyMap: {
        id: {
          kind: 'number',
          name: 'id',
          text: 'number',
        },
      },
    };

    const result = {};

    collectTypeMappersFromSourceFile(
      {
        typeMappersSourceFile: billingMapperFile,
        typeMappersSuffix: 'TypeMapper',
        resolverTypesPath: '/path/to/schemas/types.generated.ts',
      },
      result
    );
    expect(result).toEqual({
      Billing: expectedBilling,
      Payment: expectedPayment,
    });

    collectTypeMappersFromSourceFile(
      {
        typeMappersSourceFile: addressMapperFile,
        typeMappersSuffix: 'TypeMapper',
        resolverTypesPath: '/path/to/schemas/types.generated.ts',
      },
      result
    );
    expect(result).toEqual({
      Billing: expectedBilling,
      Payment: expectedPayment,
      Address: expectedAddress,
      Geo: expectedGeo,
    });

    collectTypeMappersFromSourceFile(
      {
        typeMappersSourceFile: preferenceMapperFile,
        typeMappersSuffix: 'TypeMapper',
        resolverTypesPath: '/path/to/schemas/types.generated.ts',
      },
      result
    );
    expect(result).toEqual({
      Billing: expectedBilling,
      Payment: expectedPayment,
      Address: expectedAddress,
      Geo: expectedGeo,
      Preference: expectedPreference,
      Flag: expectedFlag,
    });
  });

  it('throws error if there are duplicated mappers', () => {
    const project = new Project();
    project.createSourceFile(
      '/path/to/schemas/module1/schema.mappers.ts',
      `
      export interface UserTypeMapper {
        id: string;
      }`
    );
    project.createSourceFile(
      '/path/to/schemas/module2/schema.mappers.ts',
      `
      export type UserTypeMapper {
        id: string;
        password: string;
      }`
    );

    const result = {};

    collectTypeMappersFromSourceFile(
      {
        typeMappersSourceFile: project.getSourceFiles()[0],
        typeMappersSuffix: 'TypeMapper',
        resolverTypesPath: '/path/to/schemas/types.generated.ts',
      },
      result
    );

    expect(() =>
      collectTypeMappersFromSourceFile(
        {
          typeMappersSourceFile: project.getSourceFiles()[1],
          typeMappersSuffix: 'TypeMapper',
          resolverTypesPath: '/path/to/schemas/types.generated.ts',
        },
        result
      )
    ).toThrowErrorMatchingInlineSnapshot(`
      "GraphQL type \\"User\\" has duplicated \\"UserTypeMapper\\" mappers:
        - ./module2/schema.mappers#UserTypeMapper
        - ./module1/schema.mappers#UserTypeMapper"
    `);
  });
});
