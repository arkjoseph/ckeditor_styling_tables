<?php

namespace Drupal\ckeditor_advanced_tables\Plugin\CKEditor5Plugin;

use Drupal\ckeditor5\Annotation\CKEditor5Plugin;
use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableInterface;
use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableTrait;
use Drupal\ckeditor5\Plugin\CKEditor5PluginDefault;
use Drupal\ckeditor5\Plugin\CKEditor5PluginElementsSubsetInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\editor\EditorInterface;

/**
 * CKEditor 5 Advanced Tables plugin.
 *
 * @CKEditor5Plugin(
 *   id = "ckeditor_advanced_tables_tables",
 *   label = @Translation("Advanced Tables"),
 *   provider = "ckeditor_advanced_tables"
 * )
 */
class AdvancedTables extends CKEditor5PluginDefault implements CKEditor5PluginConfigurableInterface {
  use CKEditor5PluginConfigurableTrait;

  /**
   * @inheritDoc
   */
  public function getElementsSubset(): array
  {
    // TODO: Implement getElementsSubset() method.
  }

  /**
   * @inheritDoc
   */
  public function defaultConfiguration()
  {
    // TODO: Implement defaultConfiguration() method.
  }

  /**
   * @inheritDoc
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state)
  {
    // TODO: Implement buildConfigurationForm() method.
  }

  /**
   * @inheritDoc
   */
  public function validateConfigurationForm(array &$form, FormStateInterface $form_state)
  {
    // TODO: Implement validateConfigurationForm() method.
  }

  /**
   * @inheritDoc
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state)
  {
    // TODO: Implement submitConfigurationForm() method.
  }
}
