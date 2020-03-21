import { array, boolean, facebookAuth, file, googleAuth, image, imagePickerField, number, oAuth, playlist, selection, soundZone, string, text, theme, video } from './';
import extractProperties from './extractProperties';
import { defaultMaxSize } from './FileType';
import { imageContentTypes } from './ImageType';
import { videoContentTypes } from './VideoType';

test('Should return empty properties and strings for empty propTypes', () => {
  const { properties, strings } = extractProperties();
  expect(strings).toEqual({});
  expect(properties).toEqual([]);
});

test('Should extract properties from array', () => {
  const propTypes = {
    optional: array('Items', 'Item').items({ string: string('String') }),
    required: array('Items', 'Item')
      .items({ string: string('String') })
      .required(),
    default: array('Items', 'Item')
      .items({ string: string('String') })
      .default([{ string: 'String' }]),
    nested: array('Items', 'Item').items({
      nestedItems: array('NestedItems', 'NestedItem').items({
        string: string('String'),
      }),
    }),
  };

  const { properties, strings } = extractProperties(propTypes);
  expect(strings).toEqual({
    optional: 'Items',
    optional_singular: 'Item',
    required: 'Items',
    required_singular: 'Item',
    default: 'Items',
    default_singular: 'Item',
    nested: 'Items',
    nested_singular: 'Item',
    nestedItems: 'NestedItems',
    nestedItems_singular: 'NestedItem',
    string: 'String',
  });
  expect(properties).toEqual([
    {
      type: 'array',
      name: 'optional',
      singular_name: 'optional_singular',
      optional: true,
      constraints: {},
      properties: [
        { type: 'string', name: 'string', optional: true, constraints: {} },
      ],
    },
    {
      type: 'array',
      name: 'required',
      singular_name: 'required_singular',
      optional: false,
      constraints: {},
      properties: [
        { type: 'string', name: 'string', optional: true, constraints: {} },
      ],
    },
    {
      type: 'array',
      name: 'default',
      singular_name: 'default_singular',
      optional: true,
      constraints: {},
      properties: [
        { type: 'string', name: 'string', optional: true, constraints: {} },
      ],
      default: [{ string: 'String' }],
    },
    {
      type: 'array',
      name: 'nested',
      singular_name: 'nested_singular',
      optional: true,
      constraints: {},
      properties: [
        {
          type: 'array',
          name: 'nestedItems',
          singular_name: 'nestedItems_singular',
          optional: true,
          constraints: {},
          properties: [
            { type: 'string', name: 'string', optional: true, constraints: {} },
          ],
        },
      ],
    },
  ]);
});

test('Should extract properties from file', () => {
  const propTypes = {
    optional: file('File'),
    required: file('File').required(),
    constraints: file('File')
      .contentTypes(['a', 'b', 'c'])
      .maxSize(1),
    helper: file('File')
      .helperText('helperText')
      .helperLink('http://helper.link'),
  };

  const { properties, strings } = extractProperties(propTypes);
  expect(strings).toEqual({
    optional: 'File',
    required: 'File',
    constraints: 'File',
    helper: 'File',
    helper_helperText: 'helperText',
  });
  expect(properties).toEqual([
    {
      type: 'file',
      name: 'optional',
      optional: true,
      constraints: { 'content-length': defaultMaxSize },
    },
    {
      type: 'file',
      name: 'required',
      optional: false,
      constraints: { 'content-length': defaultMaxSize },
    },
    {
      type: 'file',
      name: 'constraints',
      optional: true,
      constraints: { 'content-types': ['a', 'b', 'c'], 'content-length': 1 },
    },
    {
      type: 'file',
      name: 'helper',
      optional: true,
      helper_text: 'helper_helperText',
      helper_link: 'http://helper.link',
      constraints: { 'content-length': defaultMaxSize },
    },
  ]);
});

test('Should extract properties from image', () => {
  const propTypes = {
    optional: image('Image'),
    required: image('Image').required(),
  };

  const { properties, strings } = extractProperties(propTypes);
  expect(strings).toEqual({
    optional: 'Image',
    required: 'Image',
  });
  expect(properties).toEqual([
    {
      type: 'file',
      name: 'optional',
      optional: true,
      constraints: {
        'content-types': imageContentTypes,
        'content-length': defaultMaxSize,
      },
    },
    {
      type: 'file',
      name: 'required',
      optional: false,
      constraints: {
        'content-types': imageContentTypes,
        'content-length': defaultMaxSize,
      },
    },
  ]);
});

test('Should extract properties from video', () => {
  const propTypes = {
    optional: video('Video'),
    required: video('Video').required(),
  };

  const { properties, strings } = extractProperties(propTypes);
  expect(strings).toEqual({
    optional: 'Video',
    required: 'Video',
  });
  expect(properties).toEqual([
    {
      type: 'file',
      name: 'optional',
      optional: true,
      constraints: {
        'content-types': videoContentTypes,
        'content-length': defaultMaxSize,
      },
    },
    {
      type: 'file',
      name: 'required',
      optional: false,
      constraints: {
        'content-types': videoContentTypes,
        'content-length': defaultMaxSize,
      },
    },
  ]);
});

test('Should extract properties from boolean', () => {
  const propTypes = {
    boolean: boolean('Boolean'),
    default: boolean('Boolean').default(true),
  };

  const { properties, strings } = extractProperties(propTypes);
  expect(strings).toEqual({
    boolean: 'Boolean',
    default: 'Boolean',
  });
  expect(properties).toEqual([
    { type: 'boolean', name: 'boolean', optional: true, constraints: {} },
    {
      type: 'boolean',
      name: 'default',
      optional: true,
      constraints: {},
      default: true,
    },
  ]);
});

test('Should extract properties from number', () => {
  const propTypes = {
    optional: number('Number'),
    required: number('Number').required(),
    default: number('Number').default(1),
    constraints: number('Number')
      .min(1)
      .max(10),
    helper: number('Number')
      .helperText('helperText')
      .helperLink('http://helper.link'),
  };

  const { properties, strings } = extractProperties(propTypes);
  expect(strings).toEqual({
    optional: 'Number',
    required: 'Number',
    default: 'Number',
    constraints: 'Number',
    helper: 'Number',
    helper_helperText: 'helperText',
  });
  expect(properties).toEqual([
    { type: 'number', name: 'optional', optional: true, constraints: {} },
    { type: 'number', name: 'required', optional: false, constraints: {} },
    {
      type: 'number',
      name: 'default',
      optional: true,
      default: 1,
      constraints: {},
    },
    {
      type: 'number',
      name: 'constraints',
      optional: true,
      constraints: { min: 1, max: 10 },
    },
    {
      type: 'number',
      name: 'helper',
      optional: true,
      helper_text: 'helper_helperText',
      helper_link: 'http://helper.link',
      constraints: {},
    },
  ]);
});

test('Should extract properties from selection', () => {
  const propTypes = {
    optional: selection('Selection'),
    required: selection('Selection').required(),
    options: selection('Selection')
      .option('a', 'A')
      .option('b', 'B')
      .default('a'),
    helper: selection('Selection')
      .helperText('helperText')
      .helperLink('http://helper.link'),
    multiple: selection('Selection').multiple(),
    optionsUrl: selection('Selection').optionsUrl('https://options.url'),
  };

  const { properties, strings } = extractProperties(propTypes);
  expect(strings).toEqual({
    optional: 'Selection',
    required: 'Selection',
    options: 'Selection',
    a: 'A',
    b: 'B',
    helper: 'Selection',
    helper_helperText: 'helperText',
    multiple: 'Selection',
    optionsUrl: 'Selection',
  });
  expect(properties).toEqual([
    {
      type: 'selection',
      name: 'optional',
      optional: true,
      options: [],
      constraints: {},
    },
    {
      type: 'selection',
      name: 'required',
      optional: false,
      options: [],
      constraints: {},
    },
    {
      type: 'selection',
      name: 'options',
      optional: true,
      options: [
        { name: 'a', value: 'a' },
        { name: 'b', value: 'b' },
      ],
      default: 'a',
      constraints: {},
    },
    {
      type: 'selection',
      name: 'helper',
      optional: true,
      helper_text: 'helper_helperText',
      helper_link: 'http://helper.link',
      constraints: {},
      options: [],
    },
    {
      type: 'selection',
      name: 'multiple',
      multiple: true,
      optional: true,
      constraints: {},
      options: [],
    },
    {
      type: 'selection',
      name: 'optionsUrl',
      optional: true,
      constraints: {},
      options: [],
      options_url: 'https://options.url',
    },
  ]);
});

test('Should not allow selection types to specify options and optionUrl', () => {
  const propTypes = {
    selection: selection('Selection')
      .optionsUrl('http://options.url')
      .option('value', 'label'),
  };

  expect(() => extractProperties(propTypes)).toThrow();
});

test('Should extract properties from string', () => {
  const propTypes = {
    optional: string('String'),
    required: string('String').required(),
    default: string('String').default('default'),
    helper: string('String')
      .helperText('helperText')
      .helperLink('http://helper.link'),
  };

  const { properties, strings } = extractProperties(propTypes);
  expect(strings).toEqual({
    optional: 'String',
    required: 'String',
    default: 'String',
    helper: 'String',
    helper_helperText: 'helperText',
  });
  expect(properties).toEqual([
    { type: 'string', name: 'optional', optional: true, constraints: {} },
    { type: 'string', name: 'required', optional: false, constraints: {} },
    {
      type: 'string',
      name: 'default',
      optional: true,
      default: 'default',
      constraints: {},
    },
    {
      type: 'string',
      name: 'helper',
      optional: true,
      helper_text: 'helper_helperText',
      helper_link: 'http://helper.link',
      constraints: {},
    },
  ]);
});

test('Should extract properties from text', () => {
  const propTypes = {
    optional: text('Text'),
    required: text('Text').required(),
    default: text('Text').default('default'),
    helper: text('Text')
      .helperText('helperText')
      .helperLink('http://helper.link'),
  };

  const { properties, strings } = extractProperties(propTypes);
  expect(strings).toEqual({
    optional: 'Text',
    required: 'Text',
    default: 'Text',
    helper: 'Text',
    helper_helperText: 'helperText',
  });
  expect(properties).toEqual([
    { type: 'text', name: 'optional', optional: true, constraints: {} },
    { type: 'text', name: 'required', optional: false, constraints: {} },
    {
      type: 'text',
      name: 'default',
      optional: true,
      default: 'default',
      constraints: {},
    },
    {
      type: 'text',
      name: 'helper',
      optional: true,
      helper_text: 'helper_helperText',
      helper_link: 'http://helper.link',
      constraints: {},
    },
  ]);
});

test('Should extract properties from theme', () => {
  const propTypes = {
    default: theme().required(),
  };

  const { properties, strings } = extractProperties(propTypes);
  expect(strings).toEqual({
    default: 'Theme',
  });
  expect(properties).toEqual([
    {
      type: 'theme',
      name: 'default',
      optional: false,
      constraints: {},
    },
  ]);
});

test('Should throw error when multiple theme prop types exist', () => {
  const propTypes = {
    theme1: theme().required(),
    theme2: theme().required(),
  };

  expect(() => extractProperties(propTypes)).toThrow();
});

test('Should set maxItems constraint', () => {
  const propTypes = {
    array: array('Item', 'Items')
      .items({ name: string('String') })
      .maxItems(4)
      .required(),
  };

  const { properties } = extractProperties(propTypes);
  expect(properties[0].constraints).toEqual({ max_items: 4 });
});

test('Should extract properties for oAuth', () => {
  const propTypes = {
    oAuth: oAuth('Connect')
      .authUrl('https://example.com/auth')
      .verifyUrl('https://example.com/verify', 'accessToken')
      .logoutUrl('https://example.com/logout', 'accessToken')
      .helperText('helperText')
      .helperLink('https://example.com/help')
      .required(),
  };

  const { properties, strings } = extractProperties(propTypes);
  expect(strings).toEqual({
    oAuth: 'Connect',
    oAuth_helperText: 'helperText',
  });
  expect(properties).toEqual([
    {
      type: 'oAuth',
      name: 'oAuth',
      optional: false,
      auth_url: 'https://example.com/auth',
      verify_url: 'https://example.com/verify',
      verify_qs_param: 'accessToken',
      logout_url: 'https://example.com/logout',
      logout_qs_param: 'accessToken',
      helper_text: 'oAuth_helperText',
      helper_link: 'https://example.com/help',
      constraints: {},
    },
  ]);
});

test('Should throw for oAuth property without auth url', () => {
  const propTypes = {
    oAuth: oAuth('Connect').verifyUrl('https://example.com/verify'),
  };
  expect(() => extractProperties(propTypes)).toThrow();
});

test('Should throw for oAuth property without verify url', () => {
  const propTypes = {
    oAuth: oAuth('Connect').authUrl('https://example.com/auth'),
  };
  expect(() => extractProperties(propTypes)).toThrow();
});

test('Should extract properties for facebookAuth', () => {
  const propTypes = {
    facebookAuth: facebookAuth()
      .authUrl('https://example.com/auth')
      .verifyUrl('https://example.com/verify', 'accessToken')
      .logoutUrl('https://example.com/logout', 'accessToken')
      .required(),
  };

  const { properties } = extractProperties(propTypes);
  expect(properties).toEqual([
    {
      type: 'facebookAuth',
      name: 'facebookAuth',
      optional: false,
      auth_url: 'https://example.com/auth',
      verify_url: 'https://example.com/verify',
      verify_qs_param: 'accessToken',
      logout_url: 'https://example.com/logout',
      logout_qs_param: 'accessToken',
      constraints: {},
    },
  ]);
});

test('Should extract properties for googleAuth', () => {
  const propTypes = {
    googleAuth: googleAuth()
      .authUrl('https://example.com/auth')
      .verifyUrl('https://example.com/verify', 'accessToken')
      .logoutUrl('https://example.com/logout', 'accessToken')
      .required(),
  };

  const { properties } = extractProperties(propTypes);
  expect(properties).toEqual([
    {
      type: 'googleAuth',
      name: 'googleAuth',
      optional: false,
      auth_url: 'https://example.com/auth',
      verify_url: 'https://example.com/verify',
      verify_qs_param: 'accessToken',
      logout_url: 'https://example.com/logout',
      logout_qs_param: 'accessToken',
      constraints: {},
    },
  ]);
});

test('Should extract properties for soundZone', () => {
  const propTypes = {
    soundZone: soundZone('SoundZone')
      .helperText('helperText')
      .helperLink('https://example.com/help'),
  };

  const { properties, strings } = extractProperties(propTypes);
  expect(strings).toEqual({
    soundZone: 'SoundZone',
    soundZone_helperText: 'helperText',
  });
  expect(properties).toEqual([
    {
      type: 'soundZone',
      name: 'soundZone',
      optional: true,
      helper_text: 'soundZone_helperText',
      helper_link: 'https://example.com/help',
      constraints: {},
    },
  ]);
});

test('Should extract properties for playlist', () => {
  const propTypes = {
    playlist: playlist('Playlist')
      .helperText('helperText')
      .helperLink('https://example.com/help'),
  };

  const { properties, strings } = extractProperties(propTypes);
  expect(strings).toEqual({
    playlist: 'Playlist',
    playlist_helperText: 'helperText',
  });
  expect(properties).toEqual([
    {
      type: 'playlist',
      name: 'playlist',
      optional: true,
      helper_text: 'playlist_helperText',
      helper_link: 'https://example.com/help',
      constraints: {},
    },
  ]);
});

test('Should extract properties from imagePickerField', () => {
  const propTypes = {
    imagesUrl: imagePickerField().imagesUrl('https://images.url'),
  };

  const { properties, strings } = extractProperties(propTypes);
  expect(strings).toEqual({
    imagesUrl: 'Image Picker',
  });
  expect(properties).toEqual([
    {
      name: 'imagesUrl',
      type: 'imagePickerField',
      optional: true,
      constraints: {},
      disable: undefined,
      hide: undefined,
      images_url: 'https://images.url',
    },
  ]);
});
