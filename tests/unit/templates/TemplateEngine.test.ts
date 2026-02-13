/**
 * Unit tests for TemplateEngine
 */

import { TemplateEngine } from '../../../src/templates/TemplateEngine';
import type { Template, TemplateData } from '../../../src/types/template.types';

describe('TemplateEngine', () => {
  let engine: TemplateEngine;

  beforeEach(() => {
    engine = new TemplateEngine({
      defaultLocale: 'en',
      cacheTemplates: true,
    });
  });

  describe('registerTemplate', () => {
    it('should register a template', () => {
      const template: Template = {
        id: 'welcome',
        name: 'Welcome Template',
        content: '{"title": "Welcome {{name}}", "body": "Hello {{name}}!"}',
        locale: 'en',
      };

      engine.registerTemplate(template);

      expect(engine.hasTemplate('welcome', 'en')).toBe(true);
    });

    it('should register templates with different locales', () => {
      const enTemplate: Template = {
        id: 'greeting',
        name: 'Greeting',
        content: '{"body": "Hello {{name}}"}',
        locale: 'en',
      };

      const esTemplate: Template = {
        id: 'greeting',
        name: 'Greeting',
        content: '{"body": "Hola {{name}}"}',
        locale: 'es',
      };

      engine.registerTemplate(enTemplate);
      engine.registerTemplate(esTemplate);

      expect(engine.hasTemplate('greeting', 'en')).toBe(true);
      expect(engine.hasTemplate('greeting', 'es')).toBe(true);
    });
  });

  describe('render', () => {
    beforeEach(() => {
      const template: Template = {
        id: 'notification',
        name: 'Notification',
        content: '{"title": "{{title}}", "body": "{{message}}"}',
        locale: 'en',
      };
      engine.registerTemplate(template);
    });

    it('should render template with data', () => {
      const data: TemplateData = {
        title: 'New Message',
        message: 'You have a new notification',
      };

      const result = engine.render('notification', data, 'en');

      expect(result.title).toBe('New Message');
      expect(result.body).toBe('You have a new notification');
    });

    it('should throw error for non-existent template', () => {
      expect(() => {
        engine.render('non-existent', {}, 'en');
      }).toThrow('Template not found');
    });

    it('should fallback to default locale', () => {
      const data: TemplateData = {
        title: 'Test',
        message: 'Test message',
      };

      const result = engine.render('notification', data, 'fr'); // fr doesn't exist

      expect(result.title).toBe('Test');
    });
  });

  describe('renderString', () => {
    it('should render template string directly', () => {
      const templateString = 'Hello {{name}}!';
      const data: TemplateData = { name: 'John' };

      const result = engine.renderString(templateString, data);

      expect(result).toBe('Hello John!');
    });

    it('should handle complex expressions', () => {
      const templateString = '{{#if premium}}Premium User: {{name}}{{else}}User: {{name}}{{/if}}';
      const data: TemplateData = { name: 'Jane', premium: true };

      const result = engine.renderString(templateString, data);

      expect(result).toBe('Premium User: Jane');
    });
  });

  describe('custom helpers', () => {
    it('should use uppercase helper', () => {
      const templateString = '{{uppercase text}}';
      const data: TemplateData = { text: 'hello' };

      const result = engine.renderString(templateString, data);

      expect(result).toBe('HELLO');
    });

    it('should use lowercase helper', () => {
      const templateString = '{{lowercase text}}';
      const data: TemplateData = { text: 'WORLD' };

      const result = engine.renderString(templateString, data);

      expect(result).toBe('world');
    });

    it('should use capitalize helper', () => {
      const templateString = '{{capitalize text}}';
      const data: TemplateData = { text: 'hello world' };

      const result = engine.renderString(templateString, data);

      expect(result).toBe('Hello world');
    });

    it('should use conditional helpers', () => {
      const templateString = '{{#if (eq status "active")}}Active{{else}}Inactive{{/if}}';
      const data: TemplateData = { status: 'active' };

      const result = engine.renderString(templateString, data);

      expect(result).toBe('Active');
    });
  });

  describe('registerHelper', () => {
    it('should register custom helper', () => {
      engine.registerHelper('reverse', (str: string) => {
        return str.split('').reverse().join('');
      });

      const templateString = '{{reverse text}}';
      const data: TemplateData = { text: 'hello' };

      const result = engine.renderString(templateString, data);

      expect(result).toBe('olleh');
    });
  });

  describe('getTemplates', () => {
    it('should return all registered templates', () => {
      const template1: Template = {
        id: 'template1',
        name: 'Template 1',
        content: 'Content 1',
      };

      const template2: Template = {
        id: 'template2',
        name: 'Template 2',
        content: 'Content 2',
      };

      engine.registerTemplate(template1);
      engine.registerTemplate(template2);

      const templates = engine.getTemplates();

      expect(templates).toHaveLength(2);
    });
  });

  describe('clearCache', () => {
    it('should clear template cache', () => {
      const template: Template = {
        id: 'test',
        name: 'Test',
        content: 'Test content',
      };

      engine.registerTemplate(template);
      expect(engine.hasTemplate('test')).toBe(true);

      engine.clearCache();
      // Templates are still registered, just cache is cleared
      expect(engine.hasTemplate('test')).toBe(true);
    });
  });
});
