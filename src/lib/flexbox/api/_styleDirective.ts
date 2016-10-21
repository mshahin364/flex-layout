import {Renderer, ElementRef, OnDestroy} from "@angular/core";
import { MediaQueries } from "../media-query/media-queries";
import modernizer from '../../utils/modernizer';

export type StyleUpdateFn = (key:string|Object, value?:string) => void;

/**
 * Abstract base class for the Layout flexbox styling directives
 */
export class BaseStyleDirective implements OnDestroy {

  // Initialize to no-op
  protected _updateStyle : StyleUpdateFn = (key:string|Object, value?:string) => { };

  constructor(elRef: ElementRef, renderer: Renderer) {
    this._updateStyle = this._buildUpdater(elRef, renderer);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngOnDestroy(){    }


  // *********************************************
  // Protected methods
  // *********************************************

  /**
   * Provide browser-specific CSS prefixes for the flexbox CSS stylings
   */
  protected _modernizer(target:any):any {
    return modernizer(target);
  }

  /**
   * Prepare style updater specific to this renderer/domEl pair
   */
  protected _buildUpdater(elRef: ElementRef, renderer: Renderer):StyleUpdateFn {
    let domEl = elRef.nativeElement;

    // Publish context-locked style updated function
    return function(source:string|Object, value?:any){
      if (typeof source === 'string') {
          renderer.setElementStyle(domEl, source, value);
      } else {
        // Iterate all properties in hashMap and set styles
        for (let key in source) {
          renderer.setElementStyle(domEl, key, source[key]);
        }
      }
    };
  }

}
