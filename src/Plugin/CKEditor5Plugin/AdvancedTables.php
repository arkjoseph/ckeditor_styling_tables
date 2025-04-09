<?php

namespace Drupal\ckeditor_advanced_tables\Plugin\CKEditor5Plugin;

use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableInterface;
use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableTrait;
use Drupal\ckeditor5\Plugin\CKEditor5PluginDefault;
use Drupal\Core\Form\FormStateInterface;
use Drupal\editor\EditorInterface;

/**
 * CKEditor 5 Advanced Tables plugin.
 *
 * @CKEditor5Plugin(
 *   id = "ckeditor_advanced_tables_tables",
 *   provider = "ckeditor_advanced_tables"
 * )
 */
class AdvancedTables extends CKEditor5PluginDefault implements CKEditor5PluginConfigurableInterface {
  use CKEditor5PluginConfigurableTrait;

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    \Drupal::logger('ckeditor_advanced_tables')->debug('Default configuration method called');
    return [
      'table_styles' => "defaultTable|usa-table|Default\ntableScrollable|default-scrollable|Scrollable (horizontal)",
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    \Drupal::logger('ckeditor_advanced_tables')->debug('Building configuration form');
    $form['table_styles'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Table styles'),
      '#description' => $this->t('Enter one style per line in the format: id|classes|label. For example: "defaultTable|usa-table|Default".'),
      '#default_value' => $this->configuration['table_styles'],
      '#rows' => 10,
    ];

    \Drupal::logger('ckeditor_advanced_tables')->debug('Form built with default value: @value', ['@value' => $this->configuration['table_styles']]);
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {
    $table_styles = $form_state->getValue('table_styles');
    \Drupal::logger('ckeditor_advanced_tables')->debug('Validating configuration: @value', ['@value' => $table_styles]);

    // Validate that each line has the correct format.
    $lines = explode("\n", $table_styles);
    $errors = [];

    foreach ($lines as $line_number => $line) {
      $line = trim($line);
      if (!empty($line)) {
        $parts = explode('|', $line);
        if (count($parts) < 3) {
          $errors[] = $this->t('Line @line: Each style must have an ID, classes, and a label, separated by "|" characters.', ['@line' => $line_number + 1]);
        }
      }
    }

    if (!empty($errors)) {
      $form_state->setError($form['table_styles'], implode('<br>', $errors));
      \Drupal::logger('ckeditor_advanced_tables')->error('Validation errors: @errors', ['@errors' => implode(', ', $errors)]);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    $this->configuration['table_styles'] = $form_state->getValue('table_styles');
    \Drupal::logger('ckeditor_advanced_tables')->debug('Configuration submitted: @value', ['@value' => $this->configuration['table_styles']]);
  }

  /**
   * {@inheritdoc}
   */
  public function getDynamicPluginConfig(array $static_plugin_config, EditorInterface $editor): array {
    \Drupal::logger('ckeditor_advanced_tables')->debug('Getting dynamic plugin config');
    try {
      $table_styles = [];

      // Parse the configuration string into an array of style objects
      $lines = explode("\n", $this->configuration['table_styles']);
      foreach ($lines as $line) {
        $line = trim($line);
        if (!empty($line)) {
          $parts = explode('|', $line, 3);
          if (count($parts) >= 3) {
            list($id, $classes, $label) = $parts;

            // Handle multiple classes by converting space-separated classes to an array
            if (strpos($classes, ' ') !== false) {
              $classes = explode(' ', $classes);
            }

            $table_styles[] = [
              'id' => $id,
              'classes' => $classes,
              'label' => $label,
            ];
          }
        }
      }

      \Drupal::logger('ckeditor_advanced_tables')->debug('Processed @count table styles', ['@count' => count($table_styles)]);

      // Add the styles to the plugin configuration
      $static_plugin_config['tableStyles'] = $table_styles;

      return $static_plugin_config;
    }
    catch (\Exception $e) {
      \Drupal::logger('ckeditor_advanced_tables')->error('Error in getDynamicPluginConfig: @error', ['@error' => $e->getMessage()]);
      // Return the static config as fallback
      return $static_plugin_config;
    }
  }
}
