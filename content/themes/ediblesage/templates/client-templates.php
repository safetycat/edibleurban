<script type="text/ng-template" id="map_popup">
<div>
    <div>{{name}}</div>
    <hr />
    <div>
        {{image ? "<img src='" : ""}} {{image}} {{image ? "'/>" : ""}}
        {{body}}
    </div>
    <hr />
    <div>
        {{area_type}} <br />
        {{suggestedUses}}
    </div>
</div>
</script>