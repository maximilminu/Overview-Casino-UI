import { useMemo, useCallback, useState } from "react";
import {
	rankWith,
	schemaTypeIs,
	computeLabel,
	findUISchema,
	composePaths,
	Resolve,
	getFirstPrimitiveProp,
	createDefaultValue,
} from "@jsonforms/core";
import {
	withJsonFormsArrayLayoutProps,
	JsonFormsDispatch,
	withJsonFormsContext,
} from "@jsonforms/react";
import {
	Paper,
	InputLabel,
	Hidden,
	List,
	ListItem,
	IconButton,
	ListItemSecondaryAction,
} from "@mui/material";
import get from "lodash/get";
import map from "lodash/map";
import range from "lodash/range";
import { PlaylistAdd, PlaylistRemove } from "@mui/icons-material";
import ConfirmDialog from "../ConfirmDialog";

const withContextToExpandPanelProps =
	(Component) =>
	({ ctx, props }) => {
		const { childLabelProp, schema, path, index, uischemas } = props;
		const childPath = composePaths(path, `${index}`);
		const childData = Resolve.data(ctx.core.data, childPath);
		const childLabel = childLabelProp
			? get(childData, childLabelProp, "")
			: get(childData, getFirstPrimitiveProp(schema), "");
		return (
			<Component
				{...props}
				dispatch={ctx.dispatch}
				childLabel={childLabel}
				childPath={childPath}
				uischemas={uischemas}
			/>
		);
	};

const ArrayItemComponent = withJsonFormsContext(
  withContextToExpandPanelProps(
    ({
      childPath,
      index,
      path,
      rootSchema,
      schema,
      uischema,
      uischemas,
      renderers,
      cells,
      openDeleteDialog,
    }) => {
      const foundUISchema = useMemo(
        () =>
          findUISchema(
            uischemas,
            schema,
            uischema.scope,
            path,
            undefined,
            uischema,
            rootSchema
          ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [uischemas, schema, uischema.scope, path, uischema, rootSchema]
      );
      return (
        <ListItem
          sx={{
            paddingTop: 0.5,
            paddingBottom: 0.5,
            paddingLeft: 0,
            paddingRight: "20px",
          }}
        >
          <JsonFormsDispatch
            schema={schema}
            uischema={foundUISchema}
            path={childPath}
            key={childPath}
            renderers={renderers}
            cells={cells}
          />
          <ListItemSecondaryAction sx={{ right: 0 }}>
            <IconButton
              edge="end"
              size="small"
              onClick={() => openDeleteDialog(path, [index])}
            >
              <PlaylistRemove fontSize="inherit" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );
    }
  )
);

const renderer = withJsonFormsArrayLayoutProps(
  ({
    visible,
    uischema,
    schema,
    label,
    rootSchema,
    renderers,
    cells,
    data,
    path,
    uischemas,
    addItem,
    removeItems,
    required,
    config,
  }) => {
    const [open, setOpen] = useState(false);
    const [itemPath, setItemPath] = useState(undefined);
    const [rowData, setRowData] = useState(undefined);
    const createDefault = useCallback(
      () => createDefaultValue(schema),
      [schema]
    );
    const addItemCb = useCallback((p, value) => addItem(p, value), [addItem]);
    const openDeleteDialog = useCallback(
      (p, rowIndex) => {
        setOpen(true);
        setItemPath(p);
        setRowData(rowIndex);
      },
      [setOpen, setItemPath, setRowData]
    );

		const deleteCancel = useCallback(() => setOpen(false), [setOpen]);

		const deleteConfirm = useCallback(() => {
			const idx = itemPath.lastIndexOf(".");
			if (idx < 1) {
				removeItems(itemPath, [rowData])();
			} else {
				const p = itemPath.substring(0, itemPath.lastIndexOf("."));
				removeItems(p, [rowData])();
			}
			setOpen(false);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [setOpen, itemPath, rowData]);

		const deleteClose = useCallback(() => setOpen(false), [setOpen]);

		const appliedUiSchemaOptions = Object.assign({}, config, uischema.options);

		label = computeLabel(
			label,
			required,
			appliedUiSchemaOptions.hideRequiredAsterisk
		);

		return (
			<Hidden xsUp={!visible}>
				<Paper
					elevation={0}
					sx={{
						backgroundColor: "third.main",
						padding: 0.5,
						marginBottom: 1,
						height: "180px",
						overflow: "auto",
					}}
				>
					<InputLabel shrink={true}>{label}</InputLabel>
					<List sx={{ padding: 0 }}>
						{data > 0
							? map(range(data), (index) => {
									return (
										<ArrayItemComponent
											index={index}
											schema={schema}
											path={path}
											uischema={uischema}
											renderers={renderers}
											cells={cells}
											key={index}
											rootSchema={rootSchema}
											enableMoveUp={index !== 0}
											enableMoveDown={index < data - 1}
											config={config}
											childLabelProp={appliedUiSchemaOptions.elementLabelProp}
											uischemas={uischemas}
											openDeleteDialog={openDeleteDialog}
										/>
									);
							  })
							: ""}
						<ListItem
							dense={true}
							alignItems="center"
							sx={{ justifyContent: "space-around" }}
						>
							<IconButton
								color="primary"
								size="small"
								onClick={addItemCb(path, createDefault())}
							>
								<PlaylistAdd fontSize="inherit" />
							</IconButton>
						</ListItem>
					</List>
				</Paper>
				<ConfirmDialog
					title="¿Estás seguro de eliminar?"
					content="¡Una vez eliminado no se podrá recuperar el dato!"
					open={open}
					onCancel={deleteCancel}
					onConfirm={deleteConfirm}
					onClose={deleteClose}
				/>
			</Hidden>
		);
	}
);

const tester = rankWith(5, schemaTypeIs("array"));

const Renderer = { tester, renderer };

export default Renderer;
