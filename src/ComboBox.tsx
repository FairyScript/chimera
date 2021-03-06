import { usePositioner } from "./Hooks/use-positioner";
import { useUid } from "./Hooks/use-uid";
import { safeBind } from "./Hooks/compose-bind";
import { useTheme } from "./Theme/Providers";
import { Text } from "./Text";
import { Touchable } from "./Touchable";
import { useMeasure, Bounds } from "./Hooks/use-measure";
import { Layer } from "./Layer";
import Highlighter from "react-highlight-words";
import { InputBase } from "./Form";
import { RefObject, MutableRefObject, ChangeEvent, createContext, FunctionComponent, useRef, useState, useCallback, HTMLAttributes, ReactType, useContext, useEffect, useLayoutEffect, Fragment } from "react";

/**
 * Combobox context
 */

interface ComboBoxContextType {
  /** element refs */
  inputRef: RefObject<HTMLInputElement>;
  listRef: RefObject<HTMLElement>;

  /** list options */
  options: MutableRefObject<string[] | null>;
  makeHash: (i: string) => string;
  selected: string | null;
  expanded: boolean;

  /** event handlers */
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: () => void;
  handleFocus: () => void;
  handleOptionSelect: (value: string) => void;
  onKeyDown: (e: KeyboardEvent) => void;

  /** popover positions */
  position: any;
  inputSize: Bounds;
  listId: string;
  query: string;
  autocomplete: boolean;
}

export const ComboBoxContext = createContext<ComboBoxContextType | null>(
  null
);

/**
 * Context provider / manager
 */

export interface ComboBoxProps {
  onSelect?: (selected: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
  autocomplete?: boolean;
}

export const ComboBox: FunctionComponent<ComboBoxProps> = ({
  children,
  onSelect,
  autocomplete = false,
  query,
  onQueryChange
}) => {
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const listId = `list${useUid()}`;
  const options = useRef<string[] | null>([]);
  const position = usePositioner({
    modifiers: {
      flip: {
        enabled: false
      }
    }
  });
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const inputSize = useMeasure(inputRef);

  /**
   * Handle input change
   */

  const onInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // potentially show popover
      setSelected(null);
      if (!expanded) {
        setExpanded(true);
      }

      onQueryChange(e.target.value);
    },
    [expanded]
  );

  /**
   * Escape key pressed
   */

  const onEscape = useCallback(() => {
    setExpanded(false);
    setSelected(null);
  }, []);

  /**
   * Enter pressed or item clicked
   */

  const onItemSelect = useCallback(() => {
    // call the parent with the selected value?
    setExpanded(false);
    onSelect && onSelect(selected as string);
    setSelected(null);
  }, [selected]);

  /**
   * Get the currently active option index
   * */

  const getSelectedIndex = useCallback(() => {
    if (!selected) return -1;
    return options.current!.indexOf(selected || "");
  }, [options, selected]);

  /**
   * Arrow up pressed
   */

  const onArrowUp = useCallback(() => {
    const opts = options.current!;
    const i = getSelectedIndex();

    // on input? cycle to bottom
    if (i === -1) {
      setSelected(opts[opts.length - 1]);

      // select prev
    } else {
      setSelected(opts[i - 1]);
    }
  }, [getSelectedIndex]);

  /**
   * Arrow down pressed
   */
  const onArrowDown = useCallback(() => {
    const opts = options.current!;
    const i = getSelectedIndex();
    // if last, cycle to first
    if (i + 1 === opts.length) {
      setSelected(opts[0]);

      // or next
    } else {
      setSelected(opts[i + 1]);
    }
  }, [getSelectedIndex, selected]);

  /**
   * Handle keydown events
   */

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          onArrowUp();
          break;
        case "ArrowDown":
          e.preventDefault();
          onArrowDown();
          break;
        case "Escape":
          e.preventDefault();
          onEscape();
          break;
        case "Enter":
          e.preventDefault();
          onItemSelect();
          break;
      }
    },
    [onArrowDown, onArrowUp, onEscape, onItemSelect]
  );

  /**
   * Handle blur events
   */

  const handleBlur = useCallback(() => {
    requestAnimationFrame(() => {
      const focusedElement = document.activeElement;
      const list = listRef.current as any;

      if (focusedElement == inputRef.current || focusedElement == list) {
        // ignore
        return;
      }

      // ignore if our popover contains the focused element
      if (list && list.contains(focusedElement)) {
        return;
      }

      // hide popover
      setExpanded(false);
      setSelected(null);
    });
  }, []);

  /**
   * handle input focus
   */

  const handleFocus = useCallback(() => {
    setExpanded(true);
  }, []);

  /**
   * Handle item clicks
   */

  const handleOptionSelect = useCallback((value: string) => {
    onSelect && onSelect(value);
    setExpanded(false);
    setSelected(null);
  }, []);

  /**
   * Make a unique hash for list + option
   */

  const makeHash = useCallback(
    (i: string) => {
      return listId + i;
    },
    [listId]
  );

  return (
    <ComboBoxContext.Provider
      value={{
        listId,
        inputRef,
        listRef,
        options,
        onInputChange,
        selected,
        onKeyDown,
        handleBlur,
        handleFocus,
        handleOptionSelect,
        position,
        makeHash,
        expanded,
        inputSize: inputSize.bounds,
        query,
        autocomplete
      }}
    >
      {children}
    </ComboBoxContext.Provider>
  );
};

/**
 * Input element
 */

export interface ComboBoxInputProps extends HTMLAttributes<any> {
  "aria-label": string;
  component?: ReactType<any>;
  [key: string]: any;
}

export const ComboBoxInput: FunctionComponent<ComboBoxInputProps> = ({
  component: Component = InputBase,
  ...other
}) => {
  const context = useContext(ComboBoxContext);
  const [localValue, setLocalValue] = useState("");

  if (!context) {
    throw new Error("ComboBoxInput must be wrapped in a ComboBox component");
  }

  const {
    onKeyDown,
    makeHash,
    selected,
    position,
    handleBlur,
    query,
    autocomplete,
    handleFocus,
    onInputChange,
    listId,
    inputRef
  } = context;

  /** support autocomplete on selection */

  useEffect(() => {
    if (!autocomplete) {
      return;
    }

    if (selected) {
      setLocalValue(selected);
    } else {
      setLocalValue("");
    }
  }, [selected, autocomplete]);

  return (
    <Component
      id={listId}
      onKeyDown={onKeyDown}
      onChange={onInputChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      aria-controls={listId}
      autoComplete="off"
      value={localValue || query}
      aria-readonly
      aria-autocomplete="list"
      role="textbox"
      aria-activedescendant={selected ? makeHash(selected) : undefined}
      {...safeBind(
        {
          ref: inputRef
        },
        {
          ref: position.target.ref
        },
        other
      )}
    />
  );
};

/**
 * Popover container
 */

export interface ComboBoxListProps
  extends HTMLAttributes<HTMLUListElement> {
  autoHide?: boolean;
}

export const ComboBoxList: FunctionComponent<ComboBoxListProps> = ({
  children,
  autoHide = true,
  ...other
}) => {
  const context = useContext(ComboBoxContext);
  const theme = useTheme();

  if (!context) {
    throw new Error("ComboBoxInput must be wrapped in a ComboBox component");
  }

  const {
    inputSize,
    expanded,
    listId,
    handleBlur,
    listRef,
    position,
    options
  } = context;

  useLayoutEffect(() => {
    options.current = [];
    return () => {
      options.current = [];
    };
  });

  return (
    <Fragment>
      {(expanded || !autoHide) && (
        <Layer
          tabIndex={-1}
          elevation="sm"
          key="1"
          style={position.popover.style}
          data-placement={position.popover.placement}
          id={listId}
          role="listbox"
          onBlur={handleBlur}
          className="ComboBoxList"
          css={{
            overflow: "hidden",
            borderRadius: theme.radii.sm,
            outline: "none",
            width:
              inputSize.width +
              inputSize.left +
              (inputSize.right - inputSize.width) +
              "px",
            margin: 0,
            padding: 0
          }}
          {...safeBind(
            {
              ref: listRef
            },
            {
              ref: position.popover.ref
            },
            other
          )}
        >
          {children}
          <div ref={position.arrow.ref} style={position.arrow.style} />
        </Layer>
      )}
    </Fragment>
  );
};

/**
 * Individual combo box options
 */

export interface ComboBoxOptionProps
  extends HTMLAttributes<HTMLLIElement> {
  value: string;
}

export const ComboBoxOption: FunctionComponent<ComboBoxOptionProps> = ({
  value,
  children,
  ...other
}) => {
  const context = useContext(ComboBoxContext);
  const theme = useTheme();

  if (!context) {
    throw new Error("ComboBoxInput must be wrapped in a ComboBox component");
  }

  const { makeHash, handleOptionSelect, options, selected } = context;

  useEffect(() => {
    if (options.current) {
      options.current.push(value);
    }
  });

  const isSelected = selected === value;

  const onClick = useCallback(() => {
    handleOptionSelect(value);
  }, [value]);

  return (
    <Touchable
      tabIndex={-1}
      id={makeHash(value)}
      role="option"
      component="li"
      onPress={onClick}
      aria-selected={isSelected ? "true" : "false"}
      css={{
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        display: "block",
        listStyleType: "none",
        margin: 0,
        padding: `0.5rem 0.75rem`,
        cursor: "pointer",
        background: isSelected ? theme.colors.background.tint1 : "none",
        "&.Touchable--hover": {
          background: theme.colors.background.tint1
        },
        "&.Touchable--active": {
          background: theme.colors.background.tint2
        }
      }}
      {...other}
    >
      {children || <ComboBoxOptionText value={value} />}
    </Touchable>
  );
};

/**
 * ComboBox Item text with highlighting
 */

export interface ComboBoxOptionTextProps {
  value: string;
}

export const ComboBoxOptionText: FunctionComponent<
  ComboBoxOptionTextProps
> = ({ value, ...other }) => {
  const context = useContext(ComboBoxContext);
  const theme = useTheme();

  if (!context) {
    throw new Error("ComboBoxInput must be wrapped in a ComboBox component");
  }

  const { query } = context;

  return (
    <Text
      className="ComboBoxOptionText"
      css={{ fontWeight: theme.fontWeights.heading }}
      {...other}
    >
      <Highlighter
        highlightStyle={{
          color: theme.colors.text.selected,
          background: "transparent"
        }}
        className="ComboBoxOptionText__Highlighter"
        searchWords={[query]}
        autoEscape={true}
        textToHighlight={value}
      />
    </Text>
  );
};
