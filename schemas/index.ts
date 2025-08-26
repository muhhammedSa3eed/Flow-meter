import { z } from 'zod';

// Step 1 Schema (System Settings)
const stepOneSchema = z.object({
  language: z.string().nonempty('Language is required'), // Language is required
  authenticationToken: z.string().nonempty('Authentication option is required'), // Authentication is required
  broadcastToClient: z.string().nonempty('Broadcast option is required'), // Broadcast option is required
  logFullMode: z.string().nonempty('Log full mode option is required'), // Log full mode option is required
});

// Step 2 Schema (SMTP Settings)
const stepTwoSchema = z.object({
  host: z.string().min(1, { message: 'Host is required' }), // Host is required
  port: z.string().min(1, { message: 'Port is required' }), // Port is required
  mailSender: z.string().email({ message: 'Invalid email address' }), // Email is required
  userApiKey: z.string().min(1, { message: 'User/ApiKey is required' }), // API key is required
  password: z.string().min(1, { message: 'Password is required' }), // Password is required
  emailTest: z.string().email({ message: 'Invalid email address for test' }), // Email test is required
});

// Step 3 Schema (DAQ Storage Settings)
const stepThreeSchema = z.object({
  retentionDAQ: z.string().nonempty('retentionDAQ option is required'),
  alarmsRetention: z.string().nonempty('Alarmsretention option is required'),
});

export const CampaignFormSchema = z.object({
  System: stepOneSchema,
  SMTP: stepTwoSchema,
  daqstoreAndAlarms: stepThreeSchema,
});

export { stepOneSchema, stepTwoSchema, stepThreeSchema };

export const ConnectionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dataAccess: z.string().min(1, 'Data Access is required'),
  databaseName: z.string().min(1, 'Database Name is required'),
  description: z.string().optional(),
  lastConnected: z.string().optional(),
  polling: z.number().optional(),
  isActive: z.boolean(),
  method: z.string().optional(),
  format: z.string().optional(),
  address: z.string().optional(),
  ip: z.string().optional(),
  port: z.number().min(1, 'port is required'),
  host: z.string().min(1, 'host is required'),
  username: z.string().min(1, 'username is required'),
  password: z.string().min(1, 'password is required'),
  slot: z.number().optional(),
  rack: z.number().optional(),
  dbType: z.string().min(1, 'Database Type is required'),
});
// .superRefine((data, ctx) => {
//   if (!data.isActive) {
//     return;
//   }

//   if (!data.dataAccess) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: "Data Access is required when enabled",
//       path: ["dataAccess"],
//     });
//   }

//   if (data.dataAccess === "WebAPI") {
//     if (!data.method) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Method is required for WebAPI",
//         path: ["method"],
//       });
//     }
//     if (!data.format) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Format is required for WebAPI",
//         path: ["format"],
//       });
//     }
//     if (!data.address) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Address is required for WebAPI",
//         path: ["address"],
//       });
//     }
//   }

//   // if (data.dataAccess === "S7") {
//   //   if (!data.ip) {
//   //     ctx.addIssue({
//   //       code: z.ZodIssueCode.custom,
//   //       message: "IP is required for S7",
//   //       path: ["ip"],
//   //     });
//   //   }
//   //   if (!data.port) {
//   //     ctx.addIssue({
//   //       code: z.ZodIssueCode.custom,
//   //       message: "Port is required for S7",
//   //       path: ["port"],
//   //     });
//   //   }
//   // }

//   if (data.dataAccess === "Database") {
//     if (!data.dbType) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Database type is required",
//         path: ["dbType"],
//       });
//     }

//     if (data.dbType === "postgresql") {
//       if (!data.host) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "Host is required for PostgreSQL",
//           path: ["host"],
//         });
//       }
//       if (!data.username) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "Username is required for PostgreSQL",
//           path: ["username"],
//         });
//       }
//       if (!data.password) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "Password is required for PostgreSQL",
//           path: ["password"],
//         });
//       }
//       if (!data.port) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "port is required for PostgreSQL",
//           path: ["port"],
//         });
//       }
//       if (!data.databaseName) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "Database Name is required for PostgreSQL",
//           path: ["databaseName"],
//         });
//       }
//     }
//   }
// });

export const AddProjectSchema = z.object({
  name: z.string().max(50).min(1, { message: 'Name is required' }),
  description: z
    .string()
    .max(1000)
    .min(1, { message: 'Description is required' }),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: ' email is required' }),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
});
export const DashboardSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),

  description: z
    .string()
    .max(5000, { message: 'Description cannot exceed 5000 characters' })
    .optional(),

  background: z.string().optional(),
  gridType: z.string().optional(),
  textColor: z.string().optional(),
});

export const UserSchema = z.object({
  name: z.string().min(1, 'Name is required'),

  email: z.string().email({ message: 'Invalid email address' }),
  phoneNumber: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number too long' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Must contain at least one special character',
    }),
  emailConfirmed: z.boolean().default(true),
  // role: z.string().min(1, { message: 'Role is required' }),
  role: z.any().optional(),
});

export const UserEditSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email({ message: 'Invalid email address' }),
  phoneNumber: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number too long' }),
  emailConfirmed: z.boolean().default(true),
  // role: z.string().min(1, { message: 'Role is required' }),
  role: z.any().optional(),
});

export const AssignUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),

  email: z.string().email({ message: 'Invalid email address' }),
  phoneNumber: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number too long' }),
  // password: z
  //   .string()
  //   .min(8, { message: "Password must be at least 8 characters" })
  //   .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
  //   .regex(/[0-9]/, { message: "Must contain at least one number" })
  //   .regex(/[^A-Za-z0-9]/, {
  //     message: "Must contain at least one special character",
  //   }),
  // emailConfirmed: z.boolean().default(true),
  // role: z.string().min(1, { message: "Role is required" }),
});

export const SignUpSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'A valid email is required' }),
    password: z
      .string()
      .min(8, { message: 'Be at least 8 characters long' })
      .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
      .regex(/[0-9]/, { message: 'Contain at least one number.' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Contain at least one special character.',
      })
      .trim(),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please enter confirm password' }),
    phoneNumber: z
      .string()
      .refine((data) => data !== '', { message: 'Phone is required' }),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: 'Paswords do not match!',
      path: ['confirmPassword'],
    }
  );
export const EditProfileSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'A valid email is required' }),
});

export const InviteSchema = z.object({
  email: z.string().email({ message: 'A valid email is required' }),
});

export const DatasetSchema = z.object({
  datasetName: z.string().min(1, { message: 'dataset name is required' }),
  table: z.string().min(1, { message: 'table is required' }),
  schema: z.string().min(1, { message: 'schema is required' }),
  database: z.string().min(1, { message: 'database is required' }),
});

export const ChartSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  datasetId: z.number().min(1, 'Dataset ID is required'),
  visualizationTypeId: z.number().min(1, 'Visualization type ID is required'),
  queryContext: z.string().optional(),
  useExistingQuery: z.boolean().default(true),
  // Dimensions
  dimensions: z.array(z.string()).optional(),
  metrics: z
    .array(
      z.object({
        metricId: z.number().nullable().optional(),
        columnName: z.string().min(1, 'Column name is required'),
        aggregationFunction: z
          .string()
          .min(1, 'Aggregation function is required'),
        customSqlExpression: z.string().nullable().optional(),
      })
    )
    .min(1, 'At least one metric is required'),
  // Filters
  precentageMetrics: z.any().optional(),
  filters: z.any().optional(),
  xAxis: z.any().optional(),
  xAxisSortBy: z.string().optional(),
  xAxisSortAscending: z.any().optional(),
  sortBy: z.array(z.unknown()).optional(),
  rowLimit: z.number().optional(),
  customizeOptions: z.any(),
  displayFields: z.any().optional(),
  columns: z.any().optional(),
  ordering: z.any().optional(),
});

export const VisualizationTypesSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  iconId: z.number(),
  displayFields: z
    .array(z.string())
    .min(1, 'At least one display field is required'),
  optionsFields: z
    .array(z.string())
    .min(1, 'At least one options field is required'),
});

export const LabQuerySchema = z.object({
  query: z.string().min(1, 'Query is required'),
  dbConnectionId: z.number().int().positive('dbConnectionId must be positive'),
  limit: z.number().optional(),
});

export const LabQuerySaveSchema = z.object({
  datasetName: z.string().min(1, 'datasetName is required'),
  schemaName: z.string().min(1, 'schemaName is required'),
  tableName: z.string().min(1, 'schemaName is required'),
  projectId: z.number().int().nonnegative(),
  fieldsAndTypes: z.record(z.string()),
});
