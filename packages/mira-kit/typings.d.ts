declare module 'mira-kit/prop-types' {
  interface ArrayType {
    required(): ArrayType;
    default(defaultValue: any[]): ArrayType;
    helperText(helperText: string): ArrayType;
    helperLink(helperLink: string): ArrayType;
    items(items: {
      [property?: string]:
        | ArrayType
        | BooleanType
        | FileType
        | NumberType
        | SelectionType
        | StringType;
    }): ArrayType;
  }
  export function array(label: string, singularLabel: string): ArrayType;

  interface BooleanType {
    required(): BooleanType;
    default(defaultValue: boolean): BooleanType;
    helperText(helperText: string): BooleanType;
    helperLink(helperLink: string): BooleanType;
  }
  export function boolean(label: string): BooleanType;

  interface FileType {
    required(): FileType;
    helperText(helperText: string): FileType;
    helperLink(helperLink: string): FileType;
    contentTypes(contentTypes: string[]): FileType;
    maxSize(bytes: number): FileType;
  }
  export function file(label: string): FileType;
  export function image(label: string): FileType;
  export function video(label: string): FileType;

  interface NumberType {
    required(): NumberType;
    default(defaultValue: number): NumberType;
    helperText(helperText: string): NumberType;
    helperLink(helperLink: string): NumberType;
    min(maxLength: number): NumberType;
    max(maxLength: number): NumberType;
  }
  export function number(label: string): NumberType;

  interface SelectionType {
    required(): SelectionType;
    default(defaultValue: boolean): SelectionType;
    helperText(helperText: string): SelectionType;
    helperLink(helperLink: string): SelectionType;
    option(value: string, label?: string): SelectionType;
  }
  export function selection(label: string): SelectionType;

  interface StringType {
    required(): StringType;
    default(defaultValue: string): StringType;
    helperText(helperText: string): StringType;
    helperLink(helperLink: string): StringType;
    maxLength(maxLength: number): StringType;
  }
  export function string(label: string): StringType;
  export function text(label: string): StringType;
}
