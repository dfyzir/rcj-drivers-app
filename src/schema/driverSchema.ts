import { EmploymentHistory } from "@/types/newDriverForm";
import dayjs, { Dayjs } from "dayjs";
import Joi from "joi";
// Regex pattern to validate US phone numbers with optional country code, parentheses, dashes, spaces, etc.
const phonePattern =
  /^(\+\d{1,3}\s?)?(\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
const ssnPattern = /^(?!000|666|9\d{2})\d{3}-?(?!00)\d{2}-?(?!0000)\d{4}$/;
const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
const ssnSchema = Joi.string()
  .pattern(ssnPattern)
  .required()
  .label("Social Security Number")
  .messages({
    "string.empty": "Social Security Number is required",
    "any.required": "Social Security Number is required",
    "string.pattern.base":
      "Social Security Number must be in the format XXX-XX-XXXX or XXXXXXXXX",
  });
export const dateValueSchema = Joi.string()
  .pattern(datePattern)
  .required()
  .label("Date")
  .messages({
    "string.empty": "Date is required",
    "string.pattern.base": "Date must be in MM/DD/YYYY format",
  });

export const driverFormSchema = Joi.object({
  firstName: Joi.string().required().label("First Name").messages({
    "string.empty": "This field is required",
  }),
  lastName: Joi.string().required().label("Last Name").messages({
    "string.empty": "This field is required",
  }),
  socialSecurity: ssnSchema,

  driversLicense: Joi.object({
    number: Joi.string().required().label("License Number").messages({
      "string.empty": "This field is required",
    }),
    state: Joi.string().required().label("License State").messages({
      "string.empty": "This field is required",
    }),
    class: Joi.string().required().label("License Class").messages({
      "string.empty": "This field is required",
    }),
    expDate: dateValueSchema.required().label("Expiration Date").messages({
      "string.empty": "This field is required",
      "string.pattern.base": "Date must be in MM/DD/YYYY format",
    }),
  })
    .required()
    .label("Driver’s License"),

  dateOfBirth: dateValueSchema.required().label("Date of Birth").messages({
    "string.empty": "This field is required",
    "string.pattern.base": "Date must be in MM/DD/YYYY format",
  }),

  physicalAddress: Joi.array()
    .items(
      Joi.object({
        street: Joi.string().required().label("Street").messages({
          "string.empty": "This field is required",
        }),
        city: Joi.string().required().label("City").messages({
          "string.empty": "This field is required",
        }),
        state: Joi.string().required().label("State").messages({
          "string.empty": "This field is required",
        }),
        zip: Joi.string()
          .pattern(/^\d{5}(-\d{4})?$/)
          .required()
          .label("Zip")
          .messages({
            "string.empty": "This field is required",
            "string.pattern.base": "Must be 5 digit or 9 digit XXXXX-XXXX",
          }),
        from: dateValueSchema.required().label("From Date").messages({
          "string.empty": "This field is required",
          "string.pattern.base": "Date must be in MM/DD/YYYY format",
        }),
        to: dateValueSchema.required().label("To Date").messages({
          "string.empty": "This field is required",
          "string.pattern.base": "Date must be in MM/DD/YYYY format",
        }),
      })
        .required()
        .label("Physical Address")
    )
    .min(1)
    .required()
    .messages({ "array.min": "At least one address is required" })

    .custom((arr: any[], helpers) => {
      const cutoff = dayjs().subtract(3, "year").startOf("day");
      const now = dayjs().endOf("day");
      const coveredMonths = arr
        .map(({ from, to }) => {
          const f = dayjs(from, "L").startOf("day");
          const t = dayjs(to, "L").endOf("day");
          // ignore ranges that end entirely before cutoff
          if (!f.isValid() || !t.isValid() || t.isBefore(cutoff)) {
            return 0;
          }
          // clamp into [cutoff … now]
          const start = f.isBefore(cutoff) ? cutoff : f;
          const end = t.isAfter(now) ? now : t;
          return end.diff(start, "month", true);
        })
        .reduce((sum, m) => sum + m, 0);

      if (coveredMonths < 36) {
        return helpers.error("array.addressThreeYears");
      }
      return arr;
    })
    .messages({
      "array.addressThreeYears":
        "Address history must cover at least the last 3 years",
    }),
  phone: Joi.string().pattern(phonePattern).required().label("Phone").messages({
    "string.empty": "This field is required",
    "string.pattern.base": "Must be valid phone number",
  }),
  altPhone: Joi.string()
    .pattern(phonePattern)
    .allow("")
    .optional()
    .label("Alt Phone")
    .messages({
      "string.empty": "This field is required",
      "string.pattern.base": "Must be valid phone number",
    }),

  drivingExperience: Joi.array()
    .items(
      Joi.object({
        equipmentType: Joi.string()
          .required()
          .label("Equipment Type")
          .messages({
            "string.empty": "This field is required",
          }),
        yearsOfExperience: Joi.string()
          .required()
          .label("Years of Experience")
          .messages({
            "string.empty": "This field is required",
          }),
        milesDriven: Joi.string().required().label("Miles Driven").messages({
          "string.empty": "This field is required",
        }),
      })
    )
    .optional()
    .label("Driving Experience"),
  accidentRecord: Joi.array()
    .items(
      Joi.object({
        accidentDate: dateValueSchema.required().label("Accident Date"),
        accidentType: Joi.string().required().label("Accident Type").messages({
          "string.empty": "This field is required",
        }),
        fatalities: Joi.string().required().label("Fatalities").messages({
          "string.empty": "This field is required",
        }),
        injuries: Joi.string().required().label("Injuries").messages({
          "string.empty": "This field is required",
        }),
      })
    )
    .optional()
    .label("Accident Record"),

  trafficConvictions: Joi.array()
    .items(
      Joi.object({
        location: Joi.string()
          .required()
          .label("Conviction Location")
          .messages({
            "string.empty": "This field is required",
          }),
        convictionDate: dateValueSchema.required().label("Conviction Date"),
        charge: Joi.string().required().label("Charge").messages({
          "string.empty": "This field is required",
        }),
      })
    )
    .optional()
    .label("Traffic Convictions"),

  licenseAndCriminalBackground: Joi.object({
    deniedLicense: Joi.boolean().required().label("Denied License"),
    suspendedRevokedLicense: Joi.boolean()
      .required()
      .label("Suspended/Revoked License"),
    descriptionForDeniedOrRevokedLicense: Joi.when("deniedLicense", {
      is: true,
      then: Joi.string()
        .required()
        .label("Reason for Denied/Revoked")
        .messages({
          "string.empty": "This field is required",
        }),
      otherwise: Joi.string().allow("").label("Reason for Denied/Revoked"),
    }),
    arrested: Joi.boolean().required().label("Arrested"),
    descriptionForArrested: Joi.when("arrested", {
      is: true,
      then: Joi.string().required().label("Reason for Arrest"),
      otherwise: Joi.string().allow("").label("Reason for Arrest"),
    }),
  })
    .required()
    .label("License & Criminal Background"),

  emergencyContact: Joi.object({
    name: Joi.string().required().label("Emergency Contact Name").messages({
      "string.empty": "This field is required",
    }),
    phone: Joi.string()
      .pattern(phonePattern)
      .required()
      .label("Emergency Contact Phone")
      .messages({
        "string.empty": "This field is required",
        "string.pattern.base": "Must be valid phone number",
      }),
    relationship: Joi.string().required().label("Relationship").messages({
      "string.empty": "This field is required",
    }),
  })
    .required()
    .label("Emergency Contact"),

  employmentHistory: Joi.array()
    .items(
      Joi.object({
        companyName: Joi.string().required().label("Company Name").messages({
          "string.empty": "This field is required",
        }),
        contactPerson: Joi.string()
          .required()
          .label("Contact Person")
          .messages({
            "string.empty": "This field is required",
          }),
        phone: Joi.string()
          .pattern(phonePattern)
          .required()
          .label("Phone")
          .messages({
            "string.empty": "This field is required",
            "string.pattern.base": "Must be valid phone number",
          }),
        street: Joi.string().required().label("Street").messages({
          "string.empty": "This field is required",
        }),
        city: Joi.string().required().label("City").messages({
          "string.empty": "This field is required",
        }),
        state: Joi.string().required().label("State").messages({
          "string.empty": "This field is required",
        }),
        zip: Joi.string()
          .pattern(/^\d{5}(-\d{4})?$/)
          .required()
          .label("Zip")
          .messages({
            "string.empty": "This field is required",
            "string.pattern.base": "Must be 5 digit or 9 digit XXXXX-XXXX",
          }),
        position: Joi.string().required().label("Position").messages({
          "string.empty": "This field is required",
        }),
        from: dateValueSchema.required().label("From Date"),
        to: dateValueSchema.required().label("To Date"),
        leaveReason: Joi.string()
          .allow("")
          .optional()
          .label("Reason for Leaving"),
        trailerType: Joi.string().allow("").optional().label("Trailer Type"),
        fmcsrSubject: Joi.boolean().required().label("FMCSR Subject"),
        dotDrugTestRegulated: Joi.boolean()
          .required()
          .label("DOT Drug Test Regulated"),
      })
    )
    .min(1)
    .required()
    .custom((arr: EmploymentHistory[], helpers) => {
      // collect valid Dayjs objects for each `to`
      const fromDates = arr
        .map((eh: EmploymentHistory) => dayjs(eh.from, "L"))
        .filter((d: Dayjs) => d.isValid());
      if (fromDates.length === 0) {
        // if none parse, skip here and let the per-item schema complain
        return arr;
      }

      // find the earliest "from" date
      const oldest = fromDates.reduce(
        (min, d: Dayjs) => (d.isBefore(min) ? d : min),
        fromDates[0]
      );

      // cutoff = today minus 10 years
      const cutoff = dayjs().subtract(10, "year");

      if (oldest.isAfter(cutoff)) {
        // oldest end date is too recent → doesn’t cover 10 years
        return helpers.error("array.hasTenYears");
      }

      // OK
      return arr;
    })
    .label("Employment History")
    .messages({
      "array.min": "At least one employment history entry is required",
      "array.hasTenYears": "Employment history must cover at least 10 years.",
    }),

  printedName: Joi.string().required().label("Printed Name").messages({
    "string.empty": "This field is required",
  }),
  date: Joi.string().required().label("Date"),
  signature: Joi.string().required().label("Signature"),

  termsAgreed: Joi.boolean()
    .valid(true)
    .required()
    .label("Terms Agreement")
    .messages({ "any.only": "You must agree to the terms" }),

  creditDisclosure: Joi.boolean()
    .valid(true)
    .required()
    .label("Credit Disclosure")
    .messages({ "any.only": "You must agree to credit disclosure" }),

  deniedLicense: Joi.boolean().required().label("Denied License"),

  suspendedOrRevoked: Joi.boolean()
    .required()
    .label("Suspended or Revoked License"),

  deniedOrRevokedExplanation: Joi.when("deniedLicense", {
    is: true,
    then: Joi.string()
      .trim()
      .min(1)
      .required()
      .label("Denied/Revoked Explanation")
      .messages({
        "string.empty": "Please explain why your license was denied or revoked",
      }),
    otherwise: Joi.when("suspendedOrRevoked", {
      is: true,
      then: Joi.string()
        .trim()
        .min(1)
        .required()
        .label("Denied/Revoked Explanation")
        .messages({
          "string.empty":
            "Please explain why your license was denied or revoked",
        }),
      otherwise: Joi.string()
        .allow("")
        .optional()
        .label("Denied/Revoked Explanation"),
    }),
  }).messages({
    "string.empty": "Please explain why your license was denied or revoked",
    "any.required": "Please explain why your license was denied or revoked",
  }),
  isConvicted: Joi.boolean().required().label("Convicted of a Crime?"),

  convictedExplanation: Joi.when("isConvicted", {
    is: true,
    then: Joi.string()
      .trim()
      .min(1)
      .required()
      .label("Conviction Explanation")
      .messages({
        "string.empty": "Please explain your conviction",
      }),
    otherwise: Joi.string()
      .allow("")
      .optional()
      .label("Conviction Explanation"),
  }).messages({
    "string.empty": "Please explain your conviction",
    "any.required": "Please explain your conviction",
  }),
  authorized: Joi.boolean()
    .valid(true)
    .required()
    .label("Authorized")
    .messages({ "any.only": "You must authorize" }),
  employmentGapExplanations: Joi.object().optional(),
})
  .required()
  .messages({ "object.base": "Submission must be an object" });
